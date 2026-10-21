# Asset Inventory

## Videos (Herbvia Brand Content)

All videos located in `public/videos/` directory. These are AI-generated brand content videos for Herbvia (health/moringa product).

| File | Category | Description |
|------|----------|-------------|
| Woman_picking_and_presenting_orange_20261018083200.mp4 | Ads & Brand Films | Product showcase, featured |
| Woman_holding_moringa_powder_packet_20261018192429.mp4 | Ads & Brand Films | Product packaging, featured |
| Woman_mixing_powder_in_water_20261018083736.mp4 | Ads & Brand Films | Daily routine sequence, featured |
| Woman_drinking_water_and_speaking_20261018191733.mp4 | Ads & Brand Films | Health drink sequence |
| Woman_pointing_at_product_20261018175523.mp4 | Ads & Brand Films | Product demonstration |
| Woman_speaking_about_spinach_iron_20261017214959.mp4 | Ads & Brand Films | Nutritional benefits |
| Girl_mixing_moringa_powder_20261017212031.mp4 | Ads & Brand Films | Younger audience version |
| Girl_playing_with_hair_20261017210613.mp4 | Ads & Brand Films | Lifestyle shot |
| Herbya_logo_animation_motion_gra_20261018182222.mp4 | Ads & Brand Films | Logo animation |
| Woman_drinking_water_speaking_Hindi_20261018192148.mp4 | Ads & Brand Films | Hindi version |
| Woman_speaking_and_drinking_beverage_20261018185025.mp4 | Ads & Brand Films | Beverage sequence |
| Woman_drinking_and_speaking_720p_20261018185636.mp4 | Ads & Brand Films | Lower resolution version |
| Woman_speaking_and_pointing_down_20261018190019.mp4 | Ads & Brand Films | Presentation shot |

Total video files: 14
Total video size: ~32 MB

## Thumbnails

Placeholder SVG thumbnails created in `public/images/`:

| File | Associated Video |
|------|-----------------|
| thumb-herbvia-picking.jpg | Woman_picking_and_presenting... |
| thumb-herbvia-holding.jpg | Woman_holding_moringa_powder... |
| thumb-herbvia-mixing.jpg | Woman_mixing_powder_in_water... |
| thumb-herbvia-drinking.jpg | Woman_drinking_water_and_speaking... |
| thumb-herbvia-speaking.jpg | Woman_speaking_about_spinach_iron... |
| thumb-herbvia-girl.jpg | Girl_mixing_moringa_powder... |
| thumb-herbvia-pointing.jpg | Woman_pointing_at_product... |
| thumb-logo-animation.jpg | Herbya_logo_animation... |

**Note**: These are placeholder SVG files. Replace with actual video frame captures for production.

## Missing Assets

### Showreel Video
- No showreel/overview video found
- Hero "Watch Showreel" button is present but needs a target video

### Professional Photograph
- No professional photograph found for About section
- Placeholder is currently displayed

### 3D Character Model
- No 3D character model (.glb/.gltf) found
- 3D character integration is ready but needs model

### Category Content
Most categories are empty and need content:
- AI Films: No projects yet
- Microdramas: No projects yet (raw footage exists in Videos/Raw Video/)
- Overview Videos: No projects yet
- Filmmaking Breakdowns: No projects yet
- Behind the Scenes: No projects yet
- AI Experiments: No projects yet

## Source Asset Locations

Original videos remain at their source location:
- Brand content: `C:/Users/PC/Videos/herbvia/ads 1/`
- Raw footage: `C:/Users/PC/Videos/Raw Video/`

**Important**: Original files have NOT been modified, moved, or deleted.

## Deployment Notes

For Cloudflare Pages deployment:
- Current total video size (~32 MB) is acceptable for initial deployment
- Cloudflare Pages limit is 25 MB per file
- All current videos are under 6 MB each
- For production, consider hosting videos externally (YouTube, Vimeo, Cloudflare Stream)

## Recommended Actions

1. Extract actual video frames for thumbnails (use FFmpeg or video editing software)
2. Provide professional photograph for About section
3. Create or provide a showreel video for hero section
4. Provide 3D character model or reference images
5. Add contact details to `src/config/contact.ts`
6. Consider external video hosting for production deployment
