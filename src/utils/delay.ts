export function delay(timeoutInMs?: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, timeoutInMs));
}
