import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for scroll-triggered animations
 * @param {Object} options - Configuration options
 * @param {number} options.threshold - Percentage of element visibility to trigger (0-1)
 * @param {string} options.rootMargin - Margin around root element
 * @param {boolean} options.triggerOnce - Whether to trigger animation only once
 * @returns {Object} - { ref, isVisible }
 */
export const useScrollAnimation = (options = {}) => {
    const {
        threshold = 0.1,
        rootMargin = '0px',
        triggerOnce = true
    } = options;

    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (triggerOnce) {
                        observer.unobserve(element);
                    }
                } else if (!triggerOnce) {
                    setIsVisible(false);
                }
            },
            {
                threshold,
                rootMargin
            }
        );

        observer.observe(element);

        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
    }, [threshold, rootMargin, triggerOnce]);

    return { ref, isVisible };
};

/**
 * Hook to animate multiple elements with staggered delays
 * @param {number} count - Number of elements to animate
 * @param {Object} options - Configuration options
 * @returns {Array} - Array of { ref, isVisible } objects
 */
export const useScrollAnimationList = (count, options = {}) => {
    const refs = useRef([]);
    const [visibleItems, setVisibleItems] = useState(new Set());

    const {
        threshold = 0.1,
        rootMargin = '0px',
        triggerOnce = true
    } = options;

    useEffect(() => {
        const currentRefs = refs.current;
        const observers = currentRefs.map((element, index) => {
            if (!element) return null;

            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setVisibleItems(prev => new Set([...prev, index]));
                        if (triggerOnce) {
                            observer.unobserve(element);
                        }
                    } else if (!triggerOnce) {
                        setVisibleItems(prev => {
                            const newSet = new Set(prev);
                            newSet.delete(index);
                            return newSet;
                        });
                    }
                },
                {
                    threshold,
                    rootMargin
                }
            );

            observer.observe(element);
            return observer;
        });

        return () => {
            observers.forEach((observer, index) => {
                if (observer && currentRefs[index]) {
                    observer.unobserve(currentRefs[index]);
                }
            });
        };
    }, [count, threshold, rootMargin, triggerOnce]);

    const setRef = (index) => (element) => {
        refs.current[index] = element;
    };

    return Array.from({ length: count }, (_, index) => ({
        ref: setRef(index),
        isVisible: visibleItems.has(index)
    }));
};

export default useScrollAnimation;
