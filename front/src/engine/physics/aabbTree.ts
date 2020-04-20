import { Shape, Rectangle, Collision, intersection } from "./";
import { Collider } from '../components';
import { assert } from "../utils";

function shapeFromCollider(collider: Collider): Shape {
    let transform = collider.object.getTransform();
    return collider.getShape().transform(transform);
}

function bboxFromCollider(collider: Collider): Rectangle {
    return shapeFromCollider(collider).boundingBox();
}

let lastId = 0;

class NodeData {
    public id: number;
    public parent: NodeData | null;
    public left: Node;
    public right: Node;
    public bbox: Rectangle;

    // Child -> parent is done but not parent -> child !
    constructor(parent: NodeData | null, left: Node, right: Node) {
        this.id = lastId++;
        this.parent = parent;
        this.left = left;
        this.right = right;
        this.bbox = left.bbox.merge(right.bbox);
        left.parent = this;
        right.parent = this;
    }

    public isLeaf(): boolean {
        return false;
    }

    public pickBest(r: InsertInfo, inheritedCost: number): void {
        let mergedArea = this.bbox.mergedArea(r.newNode.bbox);
        let cost = mergedArea + inheritedCost;
        if (cost <= r.bestCost) {
            r.bestCost = cost;
            r.bestSibling = this;
        }

        // Not sure if this piece of code belongs here or inside the condition
        let newInheritedCost = mergedArea - this.bbox.area() + inheritedCost;
        let lowerBound = r.newNode.bbox.area() + newInheritedCost;
        if (lowerBound < r.bestCost) {
            /*r.queue.push([this.left, newInheritedCost]);
            r.queue.push([this.right, newInheritedCost]);*/
            this.left.pickBest(r, newInheritedCost);
            this.right.pickBest(r, newInheritedCost);
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
            return this.left;
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
    // node is no longer valid after the call: its parent needs to be reset
    // (unless it was set to the correct value prior to the call to setNode)
    public setNode(node: Node, newNode: Node): void {
        if (node == this.left) {
            this.left = newNode;
        } else {
            this.right = newNode;
        }
        newNode.parent = this;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        this.left.draw(ctx);
        this.right.draw(ctx);
        this.bbox.draw(ctx);
    }

    public lol(): void {
        console.log("node " + this.id);
        assert(this.left.parent == this, "left is completely drunk man (node " + this.left.id + ")");
        this.left.lol();
        assert(this.right.parent == this, "wow actually right is even more so (node " + this.right.id + ")");
        this.right.lol();
    }
}

class LeafData {
    public id: number;
    public parent: NodeData | null;
    public collider: Collider;
    public bbox: Rectangle;

    constructor(collider: Collider, fatFactor: number, parent?: NodeData) {
        this.id = lastId++;
        if (parent == undefined) {
            this.parent = null;
        } else {
            this.parent = parent;
        }
        this.collider = collider;
        this.bbox = bboxFromCollider(collider).fatten(fatFactor);
    }

    public isLeaf(): boolean {
        return true;
    }

    public pickBest(r: InsertInfo, inheritedCost: number): void {
        let cost = this.bbox.mergedArea(r.newNode.bbox) + inheritedCost;
        if (cost <= r.bestCost) {
            r.bestCost = cost;
            r.bestSibling = this;
        }
    }

    public broadSearch(rect: Rectangle, r: LeafData[]): void {
        if (this.bbox.intersects(rect)) {
            r.push(this);
        }
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        this.bbox.draw(ctx);
    }

    public lol(): void {
        console.log("leaf " + this.id);
        console.log(this.bbox);
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

/**
 * @brief Performs both broad and narrow phase of collision detection between colliders.
 */
export class AABBTree implements Iterable<Collider> {
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

    public lol(): void {
        if (this.root == null) {
            console.log("empty");
        } else {
            this.root.lol();
        }
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
        parent.setNode(child, grandchild);

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
                child = _child;
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
        // but the compiler won't let this compile :(
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

    // Recomputes bounding boxes from node to the root but does not perform rotations.
    private refitNoRotation(node: NodeData | null): void {
        while (node != null) {
            node.bbox = node.right.bbox.merge(node.left.bbox);
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
            /*let e: [Node, number] | undefined;
            while ((e = r.queue.shift()) != undefined) {
                e[0].pickBest(r, e[1]);
            }*/
            if (this.root != null) {
                this.root.pickBest(r, 0);
            }

            // Adding the leaf
            let parent = r.bestSibling.parent;
            let node = new NodeData(parent, leaf, r.bestSibling);

            if (parent == null) {
                this.root = node;
            } else {
                parent.setNode(r.bestSibling, node);
                this.refit(parent);
            }
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
                parent.parent.setNode(parent, sibling);
                parent.parent = null;
                //this.refit(parent.parent);
                this.refitNoRotation(parent.parent);
            }
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

    /**
     * @brief Returns a list of all colliders that are colliding with the one provided.
     * collider itself is not included.
     * @todo Wrong return type since we need a reference to the colliding object 
     */
    public query(collider: Collider): Collision[] {
        let shape = shapeFromCollider(collider);
        let bbox = shape.boundingBox();

        let r: Collision[] = [];
        for (const leaf of this.broadSearch(bbox)) {
            if (leaf.collider != collider) {
                let collision = intersection(collider, shape, leaf.collider, shapeFromCollider(leaf.collider));
                if (collision != null) {
                    r.push(collision);
                }
            }
        }
        return r;
    } 

    /**********************************************************************************************
     * 
     * Miscellaneous
     * 
     *********************************************************************************************/

    /**
     * @brief Iterates over the contained colliders.
     */
    public [Symbol.iterator](): Iterator<Collider> {
        return this.colliders.keys();
    }

    /**
     * @brief Updates all contained objects and adapts the tree.
     */
    public update(): void {
        for (const o of this.colliders) {
            let collider: Collider = o[0];
            let leaf: LeafData = o[1];
            if (collider.object.update()) {
                // The object has moved
                let bbox = bboxFromCollider(collider);
                if (!leaf.bbox.encloses(bbox)) {
                    // The leaf's bbox no longer encloses the object's
                    this.removeLeaf(leaf);
                    leaf.bbox = bbox.fatten(this.fatFactor);
                    this.insertLeaf(leaf);
                    // We could also test if the leaf's bbox is too large
                    // (leading to poor performance)
                }
            }
        }
    }

    /**
     * @brief Draws all bounding boxes used by the tree.
     * Objects themselves are not drawn (though their bounding box are).
     */
    public draw(ctx: CanvasRenderingContext2D) {
        if (this.root != null) {
            this.root.draw(ctx);
        }
    }
}