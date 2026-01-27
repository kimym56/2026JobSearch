# Challenge 8: Image Carousel

**Time Limit:** 50 minutes
**Difficulty:** Intermediate
**Tech:** React + Vite

## Requirements

Build an image carousel/slider component.

### Must Have
1. Display one image at a time
2. Previous/Next buttons to navigate
3. Dot indicators showing current position
4. Click dot to jump to specific image
5. Disable prev button on first image
6. Disable next button on last image
7. Smooth transition between images
8. Responsive (works on mobile)

### Bonus (if time permits)
- Auto-play with pause on hover
- Swipe gestures for mobile
- Thumbnail preview
- Infinite loop mode (wraps around)
- Keyboard navigation (arrow keys)
- Lazy load images
- Fullscreen mode
- Image captions

## Sample Data

```javascript
const images = [
  {
    id: 1,
    url: 'https://picsum.photos/800/400?random=1',
    alt: 'Random image 1',
    caption: 'Beautiful landscape'
  },
  {
    id: 2,
    url: 'https://picsum.photos/800/400?random=2',
    alt: 'Random image 2',
    caption: 'City skyline'
  },
  {
    id: 3,
    url: 'https://picsum.photos/800/400?random=3',
    alt: 'Random image 3',
    caption: 'Mountain view'
  },
  {
    id: 4,
    url: 'https://picsum.photos/800/400?random=4',
    alt: 'Random image 4',
    caption: 'Ocean waves'
  },
  {
    id: 5,
    url: 'https://picsum.photos/800/400?random=5',
    alt: 'Random image 5',
    caption: 'Forest path'
  }
]
```

## Evaluation Criteria

- ✅ Navigation works smoothly
- ✅ Indicators sync with current image
- ✅ Transitions are smooth
- ✅ Edge cases handled (first/last image)
- ✅ Responsive design
- ✅ Clean code structure

## Key Concepts

- State management (current index)
- CSS transforms/transitions
- Conditional rendering
- Array manipulation
- Event handling

## Animation Options

**Option 1: CSS Transform**
```css
.carousel-track {
  display: flex;
  transition: transform 0.3s ease-in-out;
  transform: translateX(-${currentIndex * 100}%);
}
```

**Option 2: Conditional Rendering**
```javascript
{images.map((img, idx) => (
  <img
    key={img.id}
    className={idx === currentIndex ? 'active' : 'hidden'}
    src={img.url}
    alt={img.alt}
  />
))}
```

## Test Cases

1. Load carousel → should show first image
2. Click next → should show second image
3. Click previous → should go back
4. Click dot 3 → should jump to third image
5. At last image, next button disabled
6. At first image, prev button disabled
7. Dots highlight correctly
8. Transitions are smooth
9. Resize window → carousel adjusts
