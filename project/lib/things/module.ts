export function module<T, C, K>($: T, contexts: C, kernels: K): { $: T, contexts: C, kernels: K } {
  return { $, contexts, kernels }
}
