---
title: "Debounce Helper"
description: "Lightweight debounce utility for async-safe UI handlers."
date: 2025-01-15
tags: ["utility", "frontend"]
language: "TypeScript"
draft: false
hideCoverImage: true
hideTOC: false
noIndex: false
---

## Code

```ts
export type DebounceOptions = {
  wait?: number;
  leading?: boolean;
  trailing?: boolean;
};

type Timer = ReturnType<typeof setTimeout> | null;

export function debounce<T extends (...args: any[]) => unknown>(
  fn: T,
  options: DebounceOptions = {}
): (...args: Parameters<T>) => void {
  const { wait = 200, leading = false, trailing = true } = options;
  let timer: Timer = null;
  let invoked = false;

  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);

    if (leading && !invoked) {
      invoked = true;
      fn(...args);
    }

    if (trailing) {
      timer = setTimeout(() => {
        if (!leading || invoked) {
          fn(...args);
        }
        invoked = false;
        timer = null;
      }, wait);
    }
  };
}
```

## Usage

```ts
import { debounce } from "./debounce-helper";

const logResize = debounce(() => {
  console.log("resized");
}, { wait: 250, leading: false, trailing: true });

window.addEventListener("resize", logResize);
```
