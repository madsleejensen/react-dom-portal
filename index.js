import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import ReactDOM from "react-dom";

const isServer = typeof window === "undefined";
const useIsomorphicLayoutEffect = isServer ? useEffect : useLayoutEffect;

let portalUniqueId = 1123581321;

export function createPortal(targetDomId) {
  const id = targetDomId || `react-dom-portal--${portalUniqueId}`;

  portalUniqueId += 1;

  const Target = ({ children }) => {
    const nodeRef = useRef(null);
    const [hasPortalContent, setHasPortalContent] = useState(true);
    const observer = useRef(null);

    useIsomorphicLayoutEffect(() => {
      const hasChildren =
        nodeRef.current && nodeRef.current.childElementCount > 0;
      setHasPortalContent(hasChildren);
    }, [nodeRef]);

    /**
     * Detect if our `Portal.Target` target is being used anywhere.
     * If not then use fallback component (children) if defined
     */
    useEffect(() => {
      if (nodeRef.current) {
        observer.current = new MutationObserver(() => {
          const hasChildren =
            nodeRef.current && nodeRef.current.childElementCount > 0;
          setHasPortalContent(hasChildren);
        });

        observer.current.observe(nodeRef.current, {
          childList: true,
        });
      }

      return () => {
        if (observer.current) {
          observer.current.disconnect();
        }
      };
    }, [nodeRef]);

    return (
      <>
        {!hasPortalContent && children}
        <div ref={nodeRef} id={id} />
      </>
    );
  };

  const Portal = ({ children }) => {
    const containerRef = useRef();

    /**
     * lazily create our `container` which will host the portal content.
     */
    function getOrCreateContainer() {
      if (isServer()) {
        return null;
      }

      if (!containerRef.current) {
        containerRef.current = document.createElement("div");
      }

      return containerRef.current;
    }

    /**
     * find the `Portal.Target` domNode, which is needed to render `React.createPortal(..)`
     */
    useIsomorphicLayoutEffect(() => {
      if (isServer) {
        return () => {};
      }

      const targetNode = document.getElementById(id);
      if (!targetNode) {
        throw new Error(
          "Portal unable to find target, please make sure you mounted `.Target`"
        );
      }

      targetNode.appendChild(containerRef.current);

      return () => {
        if (containerRef.current) {
          containerRef.current.remove();
        }
      };
    }, [id]);

    const container = getOrCreateContainer();
    return container && ReactDOM.createPortal(children, container);
  };

  return {
    Target,
    Portal,
  };
}
