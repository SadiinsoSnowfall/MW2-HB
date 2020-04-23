import { Shape, Rectangle, Collision, intersection } from "./";
import { Collider } from '../components';
import { assert, Vec2 } from "../utils";
import PriorityQueue from "../utils/priorityQueue";

function bboxFromCollider(collider: Collider): Rectangle {
    let t = collider.object.getTransform();
    let b = collider.getShape().boundingBox(t);
    return b;
}

let lastId = 0;

class NodeData {
    public id: number;
    public parent: NodeData | null;
    public left: Node;
    public right: Node;
    public bbox: Rectangle;
    public area: number; // area of bbox, for optimization purpose

    // Child -> parent is done but not parent -> child !
    constructor(parent: NodeData | null, left: Node, right: Node) {
        this.id = lastId++;
        this.parent = parent;
        this.left = left;
        this.right = right;
        this.bbox = left.bbox.merge(right.bbox);
        this.area = this.bbox.area();
        left.parent = this;
        right.parent = this;
    }

    public isLeaf(): boolean {
        return false;
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

    public refit() {
        this.bbox = this.left.bbox.merge(this.right.bbox);
        this.area = this.bbox.area();
    }

    public checkEncloses(): void {
        this.left.checkEncloses();
        this.right.checkEncloses();
        let expected = this.left.bbox.merge(this.right.bbox);
        assert(this.bbox.encloses(expected), "Node " + this.id + " violates enclosure");
    }
}

class LeafData {
    public id: number;
    public parent: NodeData | null;
    public collider: Collider;
    public bbox: Rectangle;
    public area: number;

    constructor(collider: Collider, fatFactor: number, parent?: NodeData) {
        this.id = lastId++;
        if (parent == undefined) {
            this.parent = null;
        } else {
            this.parent = parent;
        }
        this.collider = collider;
        this.bbox = bboxFromCollider(collider);
        if (!collider.isStatic()) {
            this.bbox = this.bbox.fatten(fatFactor);
        }
        this.area = this.bbox.area();
    }

    public isLeaf(): boolean {
        return true;
    }

    public broadSearch(rect: Rectangle, r: LeafData[]): void {
        if (this.collider.object.isEnabled() && this.bbox.intersects(rect)) {
            r.push(this);
        }
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        this.bbox.draw(ctx);
    }

    public checkEncloses(): void {
        assert(this.bbox.encloses(bboxFromCollider(this.collider)), "Leaf " + this.id + " violates enclosure");
    }
}

type Node = LeafData | NodeData;

class Sibling {
    public readonly sibling: Node;
    public readonly cost: number;

    constructor(sibling: Node, cost: number) {
        this.sibling = sibling;
        this.cost = cost;
    }

    public static compare(s1: Sibling, s2: Sibling): number {
        return s1.cost - s2.cost;
    }
}

class InsertInfo {
    readonly newNode: Node;
    public best: Sibling;

    constructor(root: Node, newNode: Node) {
        this.newNode = newNode;
        this.best = new Sibling(root, root.bbox.mergedArea(newNode.bbox));
    }
}

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

    /**********************************************************************************************
     * 
     * Refitting methods (private)
     * 
     *********************************************************************************************/

    private swapLoss(parent: NodeData, child: Node, grandchild: Node): number {
        // Will never be null since it has two grandchildren
        let otherChild = (grandchild.parent as NodeData);
        let currentCost = otherChild.area;
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
            node.refit();
            this.rotate(node);
            node = node.parent;
        }
    }

    // Recomputes bounding boxes from node to the root but does not perform rotations.
    private refitNoRotation(node: NodeData | null): void {
        while (node != null) {
            node.refit();
            node = node.parent;
        }
    }


    /**********************************************************************************************
     * 
     * Insertions and removals
     * 
     *********************************************************************************************/

    private pickBest(leaf: LeafData): InsertInfo {
        // This method is only called by insertLeaf ; we already know that root != null
        let root = this.root as Node;
        let r = new InsertInfo(root, leaf);

        // Sibling#cost has a dual meaning:
        // r.best.cost is the actual cost of the best sibling, while on any other Sibling,
        // it is the inheritedCost. These two values are different for the same node.
        // https://box2d.org/files/ErinCatto_DynamicBVH_GDC2019.pdf slide 46
        let queue = new PriorityQueue<Sibling>({comparator: Sibling.compare});

        // This is not r.best because of the dual meaning of Sibling#cost
        // The inherited cost of the root is obviously 0
        queue.queue(new Sibling(root, 0));
        while (queue.length != 0) {
            let s = queue.dequeue();
            let node = s.sibling;

            if (node instanceof LeafData) {
                // node is a leaf
                let cost = node.bbox.mergedArea(r.newNode.bbox) + s.cost;
                if (cost <= r.best.cost) {
                    r.best = new Sibling(node, cost);
                }

            } else {
                // node is a node
                let mergedArea = node.bbox.mergedArea(r.newNode.bbox);
                let cost = mergedArea + s.cost;
                if (cost <= r.best.cost) {
                    r.best = new Sibling(node, cost);
                }

                let newInheritedCost = mergedArea - node.area + s.cost;
                let lowerBound = r.newNode.area + newInheritedCost;
                if (lowerBound < r.best.cost) {
                    queue.queue(new Sibling(node.left, newInheritedCost));
                    queue.queue(new Sibling(node.right, newInheritedCost));
                }
            }
        }

        return r;
    }

    private insertLeaf(leaf: LeafData) {
        // https://box2d.org/files/ErinCatto_DynamicBVH_GDC2019.pdf
        if (this.root == null) {
            this.root = leaf;
        } else {
            // Looking for the best sibling to pair leaf with
            let r = this.pickBest(leaf);

            // Adding the leaf
            let parent = r.best.sibling.parent;
            let node = new NodeData(parent, leaf, r.best.sibling);

            if (parent == null) {
                this.root = node;
            } else {
                parent.setNode(r.best.sibling, node);
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

    // Private, internal method for querying
    private _query(collider: Collider, r: Collision[], set: Set<Collider>): void {
        let bbox = bboxFromCollider(collider);
        for (const leaf of this.broadSearch(bbox)) {
            if (!set.has(leaf.collider)) {
                let collision = intersection(collider, leaf.collider);
                if (collision != null) {
                    r.push(collision);
                }
            }
        }
    }

    /**
     * @brief Returns a list of all colliders that are colliding with the one provided.
     * collider itself is not included.
     */
    public query(collider: Collider): Collision[] {
        let r: Collision[] = [];
        let set = new Set<Collider>();
        set.add(collider);
        this._query(collider, r, set);
        return r;
    }

    /**
     * @brief Returns a list of all pairs of colliders that are colliding.
     */
    public queryAll(): Collision[] {
        let r: Collision[] = [];
        let set = new Set<Collider>();
        for (let collider of this) {
            if (collider.object.hasMoved()) {
                set.add(collider);
                this._query(collider, r, set);
                collider.object.resetMoved();
            }
        }

        this.root?.checkEncloses();

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
        this.colliders.forEach((leaf, collider, map) => {
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
            } else if (!collider.object.isEnabled()) {
                // If the object has been disabled, it must be removed
                // Seems safe: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/forEach#Description
                this.remove(collider);
            }
        });
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