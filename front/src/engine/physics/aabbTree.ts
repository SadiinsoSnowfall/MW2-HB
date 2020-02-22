import { Rectangle } from "../utils"
import { Collider } from '../components';

function bboxFromCollider(collider: Collider): Rectangle {
    // TODO Must apply the object's transformations!
    return collider.getShape().boundingBox();
}

class NodeData {
    public parent: NodeData | null;
    public left: Node;
    public right: Node;
    public bbox: Rectangle;

    constructor(parent: NodeData | null, left: Node, right: Node) {
        this.parent = parent;
        this.left = left;
        this.right = right;
        this.bbox = left.bbox.merge(right.bbox);
    }

    public isLeaf(): boolean {
        return false;
    }

    public pickBest(r: InsertInfo, inheritedCost: number): void {
        let mergedArea = this.bbox.mergedArea(r.newNode.bbox);
        let cost = mergedArea + inheritedCost;
        if (cost < r.bestCost) {
            r.bestCost = cost;
            r.bestSibling = this;

            // Not sure if this piece of code belongs here or outside the condition
            let newInheritedCost = mergedArea - this.bbox.area() + inheritedCost;
            let lowerBound = r.newNode.bbox.area() + newInheritedCost;
            if (lowerBound < r.bestCost) {
                r.queue.push([this.left, newInheritedCost]);
                r.queue.push([this.right, newInheritedCost]);
            }
        }
    }

    public broadSearch(rect: Rectangle, r: LeafData[]): void {
        if (this.bbox.intersects(rect)) {
            this.left.broadSearch(rect, r);
            this.right.broadSearch(rect, r);
        }
    }

    // Returns the node's sibling (assuming node is a child)
    public getSibling(node: Node): Node {
        if (node == this.left) {
            return this.right;
        } else {
            return this.right;
        }
    }

    // Replaces node's sibling (assuming node is a child)
    public setSibling(node: Node, sibling: Node): void {
        if (node == this.left) {
            this.right = sibling;
        } else {
            this.left = sibling;
        }
        sibling.parent = this;
    }

    // Replaces node with newNode (assuming node is a child)
    public setNode(node: Node, newNode: Node): void {
        if (node == this.left) {
            this.left = newNode;
        } else {
            this.right = newNode;
        }
        newNode.parent = this;
    }
}

class LeafData {
    public parent: NodeData | null;
    public collider: Collider;
    public bbox: Rectangle;
    public fatFactor: number;

    constructor(collider: Collider, fatFactor: number, parent?: NodeData) {
        if (parent == undefined) {
            this.parent = null;
        } else {
            this.parent = parent;
        }
        this.collider = collider;
        this.bbox = bboxFromCollider(collider).fatten(fatFactor);
        this.fatFactor = fatFactor;
    }

    public isLeaf(): boolean {
        return true;
    }

    public pickBest(r: InsertInfo, inheritedCost: number): void {
        let cost = this.bbox.mergedArea(r.newNode.bbox) + inheritedCost;
        if (cost < r.bestCost) {
            r.bestCost = cost;
            r.bestSibling = this;
        }
    }

    public broadSearch(rect: Rectangle, r: LeafData[]): void {
        if (this.bbox.intersects(rect)) {
            r.push(this);
        }
    }

    // Recomputes the bounding box
    public update(): void {
        this.bbox = bboxFromCollider(this.collider).fatten(this.fatFactor);
    }
}

class InsertInfo {
    readonly newNode: Node;
    public bestSibling: Node;
    public bestCost: number;
    public queue: [Node, number][];

    constructor(root: Node, newNode: Node) {
        this.newNode = newNode;
        this.bestSibling = root;
        this.bestCost = root.bbox.mergedArea(newNode.bbox);
        this.queue = [[root, 0]];
    }
}

type Node = LeafData | NodeData;

export class AABBTree {
    private fatFactor: number;
    private root: Node | null;
    private colliders: Map<Collider, LeafData>;

    /**
     * @brief Constructs a new, empty AABB tree.
     * @param fatFactor Factor used to fatten bounding boxes
     */
    constructor(fatFactor: number = 1.1) {
        this.fatFactor = fatFactor;
        this.root = null;
        this.colliders = new Map<Collider, LeafData>();
    }

    /**********************************************************************************************
     * 
     * Refitting methods (private)
     * 
     *********************************************************************************************/

    private swapLoss(parent: NodeData, child: Node, grandchild: Node): number {
        // Will never be null since it has two grandchildren
        let otherChild = (grandchild.parent as NodeData);
        let currentCost = otherChild.bbox.area();
        let swapCost = child.bbox.mergedArea(otherChild.getSibling(grandchild).bbox);
        return swapCost - currentCost;
    }

    // Swaps child with grandchild
    private swap(parent: NodeData, child: Node, grandchild: Node): void {
        let otherChild = (grandchild.parent as NodeData);

        // Swapping child and grandchild
        otherChild.setNode(grandchild, child);
        grandchild.parent = parent;

        // Refitting otherChild
        otherChild.bbox = otherChild.left.bbox.merge(otherChild.right.bbox);
    }

    // Performs the most advantageous rotation (or none)
    private rotate(node: NodeData): void {
        let child: Node | null = null;
        let grandchild: Node | null = null;
        let min = 0;
        let _this = this;

        function setMin(_child: Node, _grandchild: Node): void {
            let loss = _this.swapLoss(node, _child, _grandchild);
            if (loss < min) {
                min = loss;
                child = node.right;
                grandchild = _grandchild;
            }
        }

        if (!node.left.isLeaf()) {
            let left = node.left as NodeData;
            setMin(node.right, left.left);
            setMin(node.right, left.right);
        }

        if (!node.right.isLeaf()) {
            let right = node.right as NodeData;
            setMin(node.left, right.left);
            setMin(node.left, right.right);
        }

        // The second condition is actually useless (since grandchild is set with child),
        // but the compiler won't let this slip away :(
        if (child != null && grandchild != null) {
            this.swap(node, child, grandchild);
        }
    }

    // Goes up the tree from node, recomputing bounding boxes and performing rotations if advantageous
    private refit(node: NodeData | null): void {
        while (node != null) {
            node.bbox = node.right.bbox.merge(node.left.bbox);
            this.rotate(node);
            node = node.parent;
        }
    }

    /**********************************************************************************************
     * 
     * Insertions and removals
     * 
     *********************************************************************************************/

    private insertLeaf(leaf: LeafData) {
        // https://box2d.org/files/ErinCatto_DynamicBVH_GDC2019.pdf
        if (this.root == null) {
            this.root = leaf;
        } else {
            // Looking for the best sibling to pair leaf with
            let r = new InsertInfo(this.root, leaf);
            let e: [Node, number] | undefined;
            while ((e = r.queue.shift()) != undefined) {
                e[0].pickBest(r, e[1]);
            }

            // Adding the leaf
            let parent = r.bestSibling.parent;
            let node = new NodeData(parent, leaf, r.bestSibling);
            leaf.parent = node;
            r.bestSibling.parent = node;

            this.refit(parent);
        }
    }

    /**
     * @brief Inserts a new collider into the tree.
     */
    public insert(collider: Collider) {
        if (this.colliders.get(collider) != undefined) {
            throw new Error("AABBTree#insert: can not insert a collider that is already contained");
        }
        let leaf = new LeafData(collider, this.fatFactor);
        this.colliders.set(collider, leaf);
        this.insertLeaf(leaf);
    }

    private removeLeaf(leaf: LeafData): void {
        let parent = leaf.parent;
        if (parent == null) {
            this.root = null;
        } else {
            let sibling = parent.getSibling(leaf);
            if (parent.parent == null) {
                this.root = sibling;
                sibling.parent = null;
            } else {
                sibling.parent = parent.parent;
                parent.parent.setNode(parent, sibling);
            }
            this.refit(parent.parent);
        }
    }

    /**
     * @brief Removes a collider from the tree.
     */
    public remove(collider: Collider): void {
        let leaf = this.colliders.get(collider);
        if (leaf == undefined) {
            throw new Error("AABBTree#remove: the tree does not contain the given collider");
        } else {
            this.removeLeaf(leaf);
            this.colliders.delete(collider);
        }
    }

    // Removes and reinserts a leaf
    private update(leaf: LeafData) {
        this.removeLeaf(leaf);
        leaf.update();
        this.insertLeaf(leaf);
    }

    /**********************************************************************************************
     * 
     * Queries
     * 
     *********************************************************************************************/

    private broadSearch(rect: Rectangle): LeafData[] {
        let r: LeafData[] = [];
        if (this.root != null) {
            this.root.broadSearch(rect, r);
        }
        return r;
    }
}