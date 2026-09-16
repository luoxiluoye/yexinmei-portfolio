/** Restore focus after a system dialog closes, including across viewport changes. */
export function focusSystemTrigger(fallback: HTMLElement | null) {
  const candidates = [
    fallback,
    ...document.querySelectorAll<HTMLButtonElement>("button[data-system-trigger]"),
  ];

  for (const target of candidates) {
    if (
      !target ||
      !document.contains(target) ||
      target === document.body ||
      target.getClientRects().length === 0 ||
      getComputedStyle(target).visibility === "hidden" ||
      target.closest('[inert], [aria-hidden="true"]')
    ) continue;

    target.focus({ preventScroll: true });
    if (document.activeElement === target) return;
  }
}
