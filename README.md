# 🏨 Atithi PMS - Open Source Property Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC.svg)](https://tailwindcss.com/)

**Atithi PMS** is an open-source, web-based Property Management System designed specifically for hospitality education and small hotels. Inspired by industry-standard systems like Fidelio PMS, Atithi provides a comprehensive learning platform where students can practice real hotel operations digitally.

## 🎯 Project Vision

- **Educational Focus**: Create a teaching-friendly PMS for hospitality students and trainers
- **Industry Standard**: Replicate real-world hotel management workflows and concepts
- **Accessibility**: Web-based system requiring no installation - runs entirely in the browser
- **Open Source**: Free for educational institutions and small properties worldwide

## ✨ Features

### 🏠 **Dashboard**
- Real-time occupancy overview
- Today's arrivals and departures
- Revenue and performance metrics
- Quick action buttons for common tasks

### 📅 **Reservations Management**
- **Individual & Group Bookings**: Complete reservation workflow with guest management
- **Real-time Availability**: Dynamic room availability checking
- **Rate Management**: Multiple rate types (Rack, Corporate, Student, Seasonal)
- **Waitlist System**: Handle overbooking scenarios professionally
- **Status Tracking**: Confirmed → Checked In → Checked Out workflow

### 👥 **Guest Management**
- **Comprehensive Profiles**: Store guest details, preferences, and booking history
- **Search & Filter**: Quick guest lookup and management
- **Booking History**: Track repeat guests and spending patterns
- **International Support**: Multi-nationality guest handling

### 🏢 **Room Inventory**
- **Room Types**: Single, Double, Suite, Dormitory configurations
- **Feature Management**: Wi-Fi, AC, TV, Mini Bar, and custom amenities
- **Status Control**: Available, Occupied, Maintenance, Dirty tracking
- **Rate Setting**: Flexible pricing per room type

### 🎯 **Front Desk Operations**
- **Check-in/Check-out**: Streamlined guest arrival and departure processes
- **In-house Guest Management**: Monitor current occupancy
- **Daily Operations**: Today's arrivals, departures, and occupancy overview

### 🧹 **Housekeeping Management**
- **Room Status Grid**: Visual room status overview
- **Cleaning Tasks**: Track dirty rooms and maintenance needs
- **Status Updates**: Real-time room condition management

### 📊 **Reports & Analytics**
- **Occupancy Reports**: Room utilization and trends
- **Revenue Analysis**: Financial performance tracking
- **ADR & RevPAR**: Industry-standard metrics calculation
- **Performance Insights**: Business intelligence for decision making

### ⚙️ **Settings & Administration**
- **User Management**: Admin, Receptionist, and Student roles
- **Hotel Configuration**: Property details and operational settings
- **Data Management**: Export/import functionality for backups
- **System Preferences**: Customizable operational parameters

## 🚀 Quick Start

### For Students

1. **Access the System**
   ```
   Open your web browser and navigate to the Atithi PMS URL
   ```

2. **Login with Demo Credentials**
   - **Student Account**: `student@atithi.com` / `student123`
   - **Receptionist Account**: `receptionist@atithi.com` / `receptionist123`
   - **Admin Account**: `admin@atithi.com` / `admin123`

3. **Start Learning**
   - Begin with the Dashboard to understand the system overview
   - Practice creating reservations using the step-by-step wizard
   - Explore guest management and room operations
   - Use keyboard shortcuts for efficient navigation

### For Administrators

1. **System Setup**
   ```bash
   # Clone the repository
   git clone https://github.com/your-org/atithi-pms.git
   cd atithi-pms
   
   # Install dependencies
   npm install
   
   # Start development server
   npm run dev
   ```

2. **Configuration**
   - Access Settings → Hotel Settings to configure your property
   - Set up room inventory in the Rooms section
   - Configure rate types and pricing
   - Create user accounts for staff and students

3. **Data Management**
   - Use Settings → Data Management for backups
   - Export data for reporting and analysis
   - Import existing guest and reservation data

## ⌨️ Keyboard Shortcuts

Atithi PMS includes comprehensive keyboard shortcuts for efficient operation:

### Navigation
- `Ctrl + H` - Dashboard
- `Ctrl + R` - Reservations
- `Ctrl + G` - Guests
- `Ctrl + M` - Rooms
- `Ctrl + S` - Settings

### Actions
- `Ctrl + N` - New Reservation
- `Ctrl + F` - Search/Find
- `/` - Show Keyboard Shortcuts Help
- `Esc` - Close Modals/Forms

*Press `/` anytime to see the complete shortcuts reference.*

## 🎓 Educational Use Cases

### **Hospitality Management Courses**
- **Front Office Operations**: Practice reservation management, check-in/out procedures
- **Revenue Management**: Understand ADR, RevPAR, and occupancy optimization
- **Guest Relations**: Learn guest profile management and service personalization
- **Hotel Operations**: Experience integrated property management workflows

### **Training Scenarios**
- **Peak Season Management**: Handle high-occupancy periods and waitlists
- **Group Bookings**: Manage corporate and tour group reservations
- **Problem Resolution**: Practice handling cancellations and modifications
- **Reporting**: Generate and analyze operational reports

### **Assessment Opportunities**
- **Practical Exams**: Students demonstrate system proficiency
- **Case Studies**: Real-world scenarios using actual hotel data
- **Workflow Understanding**: Test knowledge of hotel operational procedures

## 🛠️ Technical Architecture

### **Frontend Stack**
- **React 18.3.1**: Modern component-based UI framework
- **TypeScript**: Type-safe development for reliability
- **Tailwind CSS**: Utility-first styling for consistent design
- **Lucide React**: Professional icon library

### **Data Management**
- **Local Storage**: Client-side data persistence
- **Context API**: State management across components
- **Real-time Updates**: Immediate UI synchronization

### **Design Principles**
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Accessibility**: WCAG compliant for inclusive access
- **Performance**: Optimized for smooth operation
- **User Experience**: Intuitive workflows based on industry standards

## 📚 Learning Resources

### **Getting Started Guides**
1. **[Student Quick Start](docs/student-guide.md)** - Basic system navigation and common tasks
2. **[Instructor Manual](docs/instructor-guide.md)** - Teaching resources and assessment ideas
3. **[Administrator Guide](docs/admin-guide.md)** - System setup and configuration

### **Video Tutorials**
- System Overview and Navigation
- Creating Your First Reservation
- Managing Guest Profiles
- Front Desk Operations
- Generating Reports

### **Practice Exercises**
- Daily Front Desk Operations
- Group Booking Management
- Revenue Optimization Scenarios
- Problem-Solving Situations

## 🤝 Contributing

We welcome contributions from the hospitality education community! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### **Ways to Contribute**
- **Feature Development**: Add new PMS modules
- **Bug Reports**: Help us improve system reliability
- **Documentation**: Enhance learning resources
- **Translations**: Make Atithi accessible globally
- **Educational Content**: Share teaching scenarios and exercises

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Acknowledgments

- Inspired by industry-leading PMS systems like Fidelio, Opera, and Protel
- Built for the global hospitality education community
- Special thanks to hospitality educators who provided requirements and feedback

## 📞 Support

- **Documentation**: [Wiki](https://github.com/your-org/atithi-pms/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-org/atithi-pms/issues)
- **Discussions**: [Community Forum](https://github.com/your-org/atithi-pms/discussions)
- **Email**: support@atithi-pms.org

---

**Made with ❤️ for hospitality education worldwide**

*Atithi (अतिथि) means "guest" in Sanskrit - reflecting our commitment to exceptional guest service education.*