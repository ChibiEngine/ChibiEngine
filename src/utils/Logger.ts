module Logger {
  export function debug(...message: any) {
    console.log("[DEBUG]", ...message);
  }

  export function info(...message: any) {
    console.info("[INFO]", ...message);
  }

  export function error(...message: any) {
    console.error("[ERROR]", ...message);
  }
}

export default Logger;