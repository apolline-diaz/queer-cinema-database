"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";

export default function ProgressLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [prevPathname, setPrevPathname] = useState(pathname);
  const [prevSearchParams, setPrevSearchParams] = useState(searchParams);

  useEffect(() => {
    // Custom styles for the progress bar
    const style = document.createElement("style");
    style.textContent = `
      #nprogress {
        pointer-events: none;
      }
      
      #nprogress .bar {
        background: rgb(244, 63, 94); /* rose-500 */
        position: fixed;
        z-index: 1031;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
      }
      
      #nprogress .peg {
        display: block;
        position: absolute;
        right: 0px;
        width: 100px;
        height: 100%;
        box-shadow: 0 0 10px rgb(244, 63, 94), 0 0 5px rgb(244, 63, 94);
        opacity: 1.0;
        transform: rotate(3deg) translate(0px, -4px);
      }
    `;
    document.head.appendChild(style);

    // Configure NProgress
    NProgress.configure({
      showSpinner: false,
      trickleSpeed: 100,
      minimum: 0.1,
    });

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Monitor URL changes
  useEffect(() => {
    const hasPathnameChanged = pathname !== prevPathname;
    const hasSearchParamsChanged =
      searchParams.toString() !== prevSearchParams.toString();

    if (hasPathnameChanged || hasSearchParamsChanged) {
      // Start progress on navigation
      NProgress.start();

      // Complete the progress after a small delay to make it visible
      const timer = setTimeout(() => {
        NProgress.done();
        setPrevPathname(pathname);
        setPrevSearchParams(searchParams);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams, prevPathname, prevSearchParams]);

  return null;
}
