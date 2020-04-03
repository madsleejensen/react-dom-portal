import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';

let portalUniqueId = 1123581321;

const isBrowser = Boolean(window);

export function createPortal(targetDomId) {
  const id = targetDomId || `portal--${portalUniqueId}`;

  portalUniqueId += 1;

  const Target = ({ children }) => {
    const nodeRef = useRef(null);
    const [hasPortalContent, setHasPortalContent] = useState(true);

    /**
     * Detect if our `Portal.Target` target is being used anywhere.
     * If not then use fallback component (children) if defined
     */
    useEffect(() => {
      let childCount = 0;

      function onInsert() {
        childCount += 1;
        setHasPortalContent(true);
      }

      function onRemove() {
        childCount -= 1;
        setHasPortalContent(childCount > 0);
      }

      if (nodeRef.current) {
        nodeRef.current.addEventListener('DOMNodeInserted', onInsert, false);
        nodeRef.current.addEventListener('DOMNodeRemoved', onRemove, false);

        setHasPortalContent(Boolean(nodeRef.current.firstChild));
      }

      return () => {
        if (nodeRef.current) {
          nodeRef.current.removeEventListener(
            'DOMNodeInserted',
            onInsert,
            false
          );

          nodeRef.current.removeEventListener(
            'DOMNodeRemoved',
            onRemove,
            false
          );
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
      if (!isBrowser) {
        return null;
      }

      if (!containerRef.current) {
        containerRef.current = document.createElement('div');
      }

      return containerRef.current;
    }

    /**
     * find the `Portal.Target` domNode, which is needed to render `React.createPortal(..)`
     */
    useLayoutEffect(() => {
      if (!isBrowser) {
        return () => {};
      }

      const targetNode = document.getElementById(id);
      if (!targetNode) {
        throw new Error(
          'Portal unable to find target, please make sure you mounted `.Target`'
        );
      }

      targetNode.appendChild(containerRef.current!);

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
