"use client";
import { useEffect, useRef, type ReactNode } from "react";
export function ScrollReveal({ children, className = "" }: {
    children: ReactNode;
    className?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const node = ref.current;
        if (!node || !window.IntersectionObserver)
            return;
        const media = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (media.matches || node.getBoundingClientRect().top < window.innerHeight)
            return;
        node.dataset.reveal = "pending";
        const show = () => { node.dataset.reveal = "visible"; };
        const observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) {
            show();
            observer.disconnect();
        } }, { threshold: .08, rootMargin: "0px 0px 30px 0px" });
        const preference = () => { if (media.matches) {
            show();
            observer.disconnect();
        } };
        const focus = () => { show(); observer.disconnect(); };
        observer.observe(node);
        media.addEventListener("change", preference);
        node.addEventListener("focusin", focus);
        return () => { observer.disconnect(); media.removeEventListener("change", preference); node.removeEventListener("focusin", focus); };
    }, []);
    return <div ref={ref} className={`studio-reveal ${className}`}>{children}</div>;
}
