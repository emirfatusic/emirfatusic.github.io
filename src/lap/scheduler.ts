// One admission owner per page. Slots count at send time, even after cancellation.
export class Scheduler {
  private sent: number[] = []
  private cooldown = 0
  defer(milliseconds: number) {
    this.cooldown = Math.max(this.cooldown, Date.now() + milliseconds)
  }
  async acquire(signal: AbortSignal) {
    while (true) {
      signal.throwIfAborted()
      const now = Date.now()
      this.sent = this.sent.filter((t) => now - t < 60000)
      const recent = this.sent.filter((t) => now - t < 1000)
      const until = Math.max(
        this.cooldown,
        recent.length >= 3 ? recent[recent.length - 3] + 1000 : 0,
        this.sent.length >= 30 ? this.sent[0] + 60000 : 0,
      )
      if (until <= now) {
        this.sent.push(now)
        return
      }
      await new Promise<void>((resolve, reject) => {
        const abort = () => {
          clearTimeout(timer)
          reject(signal.reason)
        }
        const timer = setTimeout(() => {
          signal.removeEventListener('abort', abort)
          resolve()
        }, until - now)
        signal.addEventListener('abort', abort, { once: true })
      })
    }
  }
}
