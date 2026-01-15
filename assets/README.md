# Project Assets

This directory contains all static media assets for the VAIDYA healthcare platform. These assets are used throughout the application and in GitHub documentation to showcase the project's features and functionality.

## Directory Structure

```
public/assets/
├── images/
│   ├── screenshots/     # 📸 Application screenshots for GitHub README
│   ├── logos/          # 🎨 Project logos, icons, and branding materials
│   └── ui/             # 🖼️ UI component examples and design system assets
├── videos/
│   ├── demos/          # 🎥 Full application demos and feature walkthroughs
│   └── tutorials/      # 📚 Tutorial videos for user onboarding
└── docs/               # 📖 Documentation images and technical diagrams
```

## 📁 Directory Descriptions

### 📸 `images/screenshots/`
**Purpose**: High-quality screenshots showcasing VAIDYA's user interface and key features for GitHub documentation.

**Contents**:
- `homepage.png` - Main landing page with service overview
- `login_page.png` - User authentication interface
- `Dashboard.png` - Health metrics and analytics dashboard
- `Diagnosis_page.png` - AI-powered symptom analysis interface
- `Profile.png` - User profile and medical history management

**Usage**: Displayed in the main README.md to give visitors immediate visual understanding of the application.

### 🎨 `images/logos/`
**Purpose**: Brand assets including the VAIDYA logo, app icons, and other branding materials.

**Best Practices**:
- Store multiple formats (PNG, SVG, ICO)
- Include different sizes for various use cases
- Maintain consistent branding across all assets

### 🖼️ `images/ui/`
**Purpose**: UI component examples, design system documentation, and interface element showcases.

**Use Cases**:
- Component library documentation
- Design system references
- UI/UX portfolio pieces

### 🎥 `videos/demos/`
**Purpose**: Full application demonstrations and feature walkthroughs.

**Current Contents**:
- `VAIDYA.mp4` - Complete application demo showcasing all major features (59MB)

**Specifications**:
- Format: MP4 with H.264 encoding
- Recommended length: 2-5 minutes
- Resolution: 1920x1080 or higher
- File size: Keep under 100MB for GitHub compatibility

### 📚 `videos/tutorials/`
**Purpose**: Step-by-step tutorial videos for user onboarding and feature explanations.

**Best Practices**:
- Short, focused videos (under 2 minutes each)
- Clear audio narration
- On-screen text overlays for key points
- Consistent branding and intro/outro

### 📖 `docs/`
**Purpose**: Technical documentation images, architecture diagrams, and explanatory visuals.

**Content Types**:
- System architecture diagrams
- Database schemas
- API documentation visuals
- Workflow diagrams
- Technical illustrations

## 🚀 GitHub Integration

### How Assets Are Used in README.md

```markdown
<!-- Screenshots -->
![Dashboard](/assets/images/screenshots/Dashboard.png)

<!-- Videos with clickable thumbnails -->
[![Watch Demo](/assets/images/screenshots/homepage.png)](/assets/videos/demos/VAIDYA.mp4)
```

### File Naming Conventions

- **Screenshots**: Use descriptive names in PascalCase (e.g., `Dashboard.png`)
- **Logos**: Include size and format (e.g., `vaidya-logo-256px.png`)
- **Videos**: Include version and length (e.g., `VAIDYA-demo-v1-3min.mp4`)
- **Documentation**: Use descriptive, SEO-friendly names

### Optimization Guidelines

#### Images
- **Format**: PNG for UI screenshots, JPEG for photos
- **Size**: Keep under 2MB per image for fast loading
- **Resolution**: 1920x1080 for desktop screenshots
- **Compression**: Use tools like TinyPNG or ImageOptim

#### Videos
- **Format**: MP4 with H.264 encoding
- **Size**: Keep under 50MB for better GitHub performance
- **Compression**: Use HandBrake with CRF 23-28
- **Thumbnails**: Create custom preview images

## 🔄 Maintenance

### Regular Tasks
1. **Update screenshots** when UI changes occur
2. **Re-record demos** for major feature updates
3. **Optimize file sizes** to ensure fast loading
4. **Review and update** alt text and descriptions
5. **Backup assets** to external storage

### Version Control
- All assets are tracked in Git for version history
- Use descriptive commit messages for asset changes
- Consider using Git LFS for very large files in the future

## 📊 Current Asset Summary

| Type | Count | Total Size | Usage |
|------|-------|------------|-------|
| Screenshots | 5 | ~470KB | README.md showcase |
| Demo Videos | 1 | 59MB | Feature demonstration |
| Logos | 0 | 0KB | Branding (placeholder) |
| Documentation | 0 | 0KB | Technical docs (placeholder) |

---

**Last Updated**: January 2026  
**Maintainer**: Shivaraj N Kengannavar
