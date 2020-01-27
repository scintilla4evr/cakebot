import { Worker } from "worker_threads"

export function spawnWorker(
    workerFile: string, data: any
): Promise<any> {
    let worker = new Worker(workerFile)

    worker.on("online", () => {
        worker.postMessage(data)
    })

    return new Promise((resolve, reject) => {
        worker.once("message", (value) => resolve(value))
    })
}