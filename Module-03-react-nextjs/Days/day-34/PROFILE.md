# Addis Eats Performance Profile

## Goal

The goal was to identify an unnecessary render in Addis Eats and apply one targeted optimization based on measurement.

No broad memoization was added without profiling evidence.

## Before Optimization

I used the React DevTools Profiler while opening the Quick View modal from the menu.

### Test

1. Open the Addis Eats menu.
2. Start a React DevTools Profiler recording.
3. Click Quick View on a dish.
4. Stop the recording.
5. Inspect the DishList render.

### Measurement

Component:

`DishList`

Before optimization:

`19.5 ms`

### Observation

The Profiler showed that opening Quick View caused the DishList component to render.

The original DishList created each dish item directly and created new callback functions while rendering the list.

## Optimization

I extracted each dish card into a separate `DishItem` component.

`DishItem` was wrapped with `memo()` so unchanged dish items can skip rendering when their props remain the same.

I also used `useCallback()` for the Add and Quick View handlers so the callback references remain stable when their dependencies have not changed.

This optimization was chosen after profiling showed a measurable DishList render during the Quick View interaction.

## After Optimization

I repeated the same React DevTools Profiler test using the same Quick View interaction.

Component:

`DishList`

After optimization:

`3.8 ms`

### Result

The measured DishList render decreased from `19.5 ms` to `3.8 ms` in this profiling run.

That is a reduction of `15.7 ms` in the measured render time.

The result is specific to this test interaction and this development environment; it does not mean the entire application is 80.5% faster.

## Conclusion

The optimization was based on an observed rendering pattern rather than being added only as a general React best practice.

No additional memoization was added because the menu is small and further optimization would require additional profiling evidence.