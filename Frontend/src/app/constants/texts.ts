
export const AppText = {
    hero:{
        tagline: 'Collect the days that make you, you.',
        subheading: 'Your personal diary to write, reflect, and remember — one day at a time.'
    },
    
    form: {
        labels:{
            usename: 'User Name :',
            email: 'E-mail :',
            securityQuestion: 'Journal Recovery Prompt :',
            securityAnswer: 'Your answer :',
            password: 'Password :',
            usernameOrEmail : 'Username or Email :',
        },
        placeholders: {
            usename: 'Enter the Username...',
            email: 'Enter the Email...',
            securityQuestion: 'Choose a prompt you\'ll remember',
            securityAnswer: 'Enter something memorable...',
            password: 'Enter the Password...',
            usernameOrEmail : 'Enter a Username or Email...',
        },
        errors: {
            required: 'This field is required.',
            emailPattern: 'Please enter a valid email address.',
            minLength: (min: number) => `Please enter at least ${min} characters.`,
            maxLength: (max: number) => `Must be less than ${max} characters.`,
            passwordComplexity: "Password must be at least 6 characters and include a lowercase letter, an uppercase letter, a number, and a special character."
        },
        buttons: {
            signup: 'Create Account',
            signIn: 'Sign In'
        }
    },

    links:{
        
    },

    home: {
        welcome: 'Hello, Alex 👋',
        startWriting: 'What’s on your mind?',
        recentEntries: 'Recent Entries',
        emptyState: 'You haven’t written anything yet. Start your first entry!'
    },

    settings: {
        themeToggle: 'Toggle Theme',
        exportData: 'Export or Backup Your Entries',
        avatarPicker: 'Choose Your Avatar'
    },

    textEditor:{
        placeholder: 'Enter the text...'
    }
}