# Contributing to Atithi PMS

Thank you for your interest in contributing to Atithi PMS! This document provides guidelines and information for contributors.

## 🎯 Project Mission

Atithi PMS is an open-source Property Management System designed specifically for hospitality education. Our goal is to provide students, educators, and small hotels with a comprehensive, industry-standard learning platform.

## 🤝 How to Contribute

### Types of Contributions

We welcome various types of contributions:

1. **Code Contributions**
   - New features and modules
   - Bug fixes and improvements
   - Performance optimizations
   - UI/UX enhancements

2. **Documentation**
   - User guides and tutorials
   - API documentation
   - Educational resources
   - Video tutorials

3. **Educational Content**
   - Practice scenarios
   - Assessment materials
   - Case studies
   - Training exercises

4. **Translations**
   - Interface translations
   - Documentation translations
   - Educational content localization

5. **Testing & Quality Assurance**
   - Bug reports
   - Feature testing
   - Usability feedback
   - Performance testing

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git
- Basic knowledge of React, TypeScript, and Tailwind CSS

### Development Setup

1. **Fork the Repository**
   ```bash
   # Fork the repo on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/atithi-pms.git
   cd atithi-pms
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

### Development Guidelines

#### Code Style

- **TypeScript**: Use TypeScript for all new code
- **ESLint**: Follow the existing ESLint configuration
- **Prettier**: Code formatting is handled automatically
- **Naming Conventions**: 
  - Components: PascalCase (`ReservationForm.tsx`)
  - Files: camelCase for utilities, PascalCase for components
  - Variables: camelCase
  - Constants: UPPER_SNAKE_CASE

#### Component Structure

```typescript
// Component template
import React, { useState } from 'react';
import { Icon } from 'lucide-react';

interface ComponentProps {
  // Define props with TypeScript
}

const ComponentName: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Component logic
  
  return (
    <div className="component-container">
      {/* Component JSX */}
    </div>
  );
};

export default ComponentName;
```

#### Styling Guidelines

- **Tailwind CSS**: Use Tailwind utility classes
- **Responsive Design**: Ensure mobile compatibility
- **Accessibility**: Include proper ARIA labels and keyboard navigation
- **Color Scheme**: Follow the established design system
  - Primary: Blue (#3B82F6)
  - Success: Green (#10B981)
  - Warning: Amber (#F59E0B)
  - Error: Red (#EF4444)

#### State Management

- **Context API**: Use React Context for global state
- **Local State**: Use useState for component-specific state
- **Data Persistence**: Use localStorage for client-side persistence

## 📝 Contribution Process

### 1. Issue Creation

Before starting work, create or find an existing issue:

- **Bug Reports**: Use the bug report template
- **Feature Requests**: Use the feature request template
- **Questions**: Use GitHub Discussions

### 2. Development

- Write clean, documented code
- Follow existing patterns and conventions
- Add TypeScript types for all new code
- Ensure responsive design
- Test your changes thoroughly

### 3. Testing

- Test all functionality manually
- Ensure no existing features are broken
- Test on different screen sizes
- Verify keyboard navigation works

### 4. Documentation

- Update relevant documentation
- Add JSDoc comments for complex functions
- Update README if needed
- Create or update user guides

### 5. Pull Request

Create a pull request with:

- **Clear Title**: Describe what the PR does
- **Description**: Explain the changes and why they're needed
- **Screenshots**: For UI changes, include before/after screenshots
- **Testing**: Describe how you tested the changes
- **Breaking Changes**: Note any breaking changes

#### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Other (please describe)

## Testing
- [ ] Manual testing completed
- [ ] Responsive design verified
- [ ] Keyboard navigation tested
- [ ] No existing functionality broken

## Screenshots (if applicable)
[Add screenshots here]

## Additional Notes
[Any additional information]
```

## 🎓 Educational Contributions

### Creating Educational Content

1. **Practice Scenarios**
   - Real-world hotel situations
   - Step-by-step solutions
   - Learning objectives
   - Assessment criteria

2. **Training Materials**
   - User guides with screenshots
   - Video tutorials
   - Interactive exercises
   - Instructor resources

3. **Assessment Tools**
   - Practical exercises
   - Evaluation rubrics
   - Progress tracking
   - Certification criteria

### Content Guidelines

- **Clarity**: Write for hospitality students with varying technical skills
- **Accuracy**: Ensure content reflects real industry practices
- **Accessibility**: Make content available to diverse learners
- **Updates**: Keep content current with system changes

## 🌍 Internationalization

### Adding Translations

1. **Language Files**: Create translation files in `src/locales/`
2. **Component Updates**: Use translation keys instead of hardcoded text
3. **Testing**: Verify translations work correctly
4. **Documentation**: Update language-specific documentation

### Translation Guidelines

- **Hospitality Terms**: Use industry-standard terminology
- **Cultural Sensitivity**: Consider cultural differences in hospitality
- **Consistency**: Maintain consistent terminology throughout
- **Context**: Provide context for translators

## 🐛 Bug Reports

### Creating Effective Bug Reports

Include the following information:

1. **Environment**
   - Browser and version
   - Operating system
   - Screen resolution
   - User role (Admin, Receptionist, Student)

2. **Steps to Reproduce**
   - Detailed step-by-step instructions
   - Expected behavior
   - Actual behavior
   - Screenshots or videos if helpful

3. **Impact**
   - How does this affect users?
   - Is it blocking critical functionality?
   - Workarounds available?

## 💡 Feature Requests

### Proposing New Features

1. **Educational Value**: How does this help hospitality education?
2. **Industry Relevance**: Is this used in real hotel operations?
3. **User Impact**: Who benefits from this feature?
4. **Implementation**: High-level approach to implementation
5. **Alternatives**: Other ways to achieve the same goal

### Feature Categories

- **Core PMS Features**: Essential hotel management functionality
- **Educational Tools**: Learning aids and assessment features
- **User Experience**: Interface and usability improvements
- **Integration**: Connections with external systems
- **Reporting**: Analytics and business intelligence

## 📋 Code Review Process

### For Contributors

- Be open to feedback and suggestions
- Respond promptly to review comments
- Make requested changes in a timely manner
- Ask questions if feedback is unclear

### For Reviewers

- Be constructive and helpful
- Focus on code quality and educational value
- Consider the learning experience for students
- Suggest improvements rather than just pointing out problems

## 🏆 Recognition

Contributors are recognized in several ways:

- **Contributors List**: Listed in README and documentation
- **Release Notes**: Mentioned in version release notes
- **Community Highlights**: Featured in project updates
- **Educational Credits**: Acknowledged in educational materials

## 📞 Getting Help

### Communication Channels

- **GitHub Issues**: Technical problems and feature requests
- **GitHub Discussions**: General questions and community discussion
- **Email**: Direct contact for sensitive issues
- **Documentation**: Comprehensive guides and tutorials

### Response Times

- **Bug Reports**: 2-3 business days
- **Feature Requests**: 1 week
- **Pull Requests**: 3-5 business days
- **General Questions**: 1-2 business days

## 📜 Code of Conduct

### Our Standards

- **Respectful**: Treat all community members with respect
- **Inclusive**: Welcome contributors from all backgrounds
- **Educational**: Focus on learning and teaching
- **Professional**: Maintain professional standards
- **Collaborative**: Work together toward common goals

### Unacceptable Behavior

- Harassment or discrimination
- Inappropriate language or content
- Personal attacks or insults
- Spam or off-topic discussions
- Violation of privacy

### Enforcement

Community leaders will:
- Address violations promptly and fairly
- Provide warnings for minor infractions
- Remove content that violates standards
- Ban users for serious or repeated violations

## 🎉 Thank You

Your contributions help make hospitality education more accessible and effective worldwide. Whether you're fixing a bug, adding a feature, creating educational content, or helping other users, you're making a difference in hospitality education.

Together, we're building a tool that will help train the next generation of hospitality professionals!

---

**Questions?** Feel free to reach out through any of our communication channels. We're here to help!