declare const require: any
const TinyQueue = require('tinyqueue').default

class PriorityQueue<T> {
    queue: any
    constructor() {
        this.queue = new TinyQueue([], (a: any, b: any) => a.priority - b.priority)
    }

    push(value: T, priority: number) {
        this.queue.push({ value, priority })
    }

    pop(): T {
        return this.queue.pop().value
    }

    get length(): number {
        return this.queue.length
    }
}


export function dijkstra<T>(props: { start: T, goal: T, expand: (node: T) => T[] }): T[] {
    const { start, goal, expand } = props
    const frontier = new PriorityQueue<T>()
    frontier.push(start, 0)
    const cameFrom: Map<T, T|undefined> = new Map()
    const costSoFar: Map<T, number> = new Map()
    cameFrom.set(start, undefined)
    costSoFar.set(start, 0)

    while (frontier.length > 0) {
        const current = frontier.pop()  

        if (current === goal)
            break;

        for (const nextCell of expand(current)) {
            const newCost = (costSoFar.get(current)||0) + 1
            const prevCost = costSoFar.get(nextCell)
            if (prevCost === undefined || newCost < prevCost) {
                costSoFar.set(nextCell, newCost)
                frontier.push(nextCell, newCost)
                cameFrom.set(nextCell, current)
            }
        }
    }

    if (!cameFrom.has(goal))
        return []
    else {
        const path = []
        let current = goal
        while (current != start) {
            path.push(current)
            current = cameFrom.get(current) as T
        }
        path.reverse()
        return path
    }
}