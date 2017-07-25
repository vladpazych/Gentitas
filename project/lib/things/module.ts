export function module<T, C, K>(alias: T, contexts: C, kernels: K): { alias: T, contexts: C, kernels: K } {
  return { alias, contexts, kernels }
}
