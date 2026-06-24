import { reactive } from 'vue'

const state = reactive({
  personal: {
    name: 'Alex Chen',
    title: 'Frontend Developer',
    email: 'alex.chen@example.com',
    phone: '+86 138 0000 1234',
    location: 'Beijing, China',
    customDetails: [], // e.g., { label: 'Nationality', value: 'Chinese' }
    socialLinks: [],   // e.g., { label: 'Website', url: 'https://alexchen.dev' }
    summary: 'Passionate frontend developer with expertise in React, TypeScript, and modern CSS. Seeking internship opportunities to apply my skills in building performant, user-friendly web applications.'
  },
  sections: [
    {
      id: 'summary',
      type: 'summary',
      title: 'Summary',
      visible: true
    },
    {
      id: 'experience',
      type: 'experience',
      title: 'Job Experience',
      visible: true,
      items: []
    },
    {
      id: 'education',
      type: 'education',
      title: 'Education',
      visible: true,
      items: [
        {
          id: 1,
          school: 'Peking University',
          degree: 'Bachelor of Computer Science',
          startDate: '2021-09',
          endDate: '2025-07',
          description: 'GPA 3.8/4.0 - Dean\'s List 2022-2024'
        }
      ]
    },
    {
      id: 'skills',
      type: 'skills',
      title: 'Skills',
      visible: true,
      items: ['Vue', 'TypeScript', 'Node.js', 'CSS']
    }
  ],
  theme: {
    lineHeight: 1.5,
    fontFamily: 'Inter',
    primaryColor: '#2563eb',
    titleColor: '#2563eb',
    textColor: '#333333',
    headerAlignment: 'left',
    headerDetailsArrangement: 'row',
    iconStyle: 'solid',
    // New Typography Settings
    fontSize: {
      base: 9, // Using points as in the screenshot
      name: 20, // +11pt
      title: 14, // +5pt
      headings: 10, // +1pt
      entryHeader: 9 // +0pt
    },
    // New Spacing
    marginX: 20,
    marginY: 20,
    // New Heading Styles
    headingStyle: 'underline', // 'underline', 'border-top-bottom', etc.
    headingCapitalization: 'uppercase' // 'capitalize', 'uppercase'
  }
})

export function useResume() {
  const addSection = (type, title) => {
    const newSection = {
      id: Date.now().toString(),
      type,
      title,
      visible: true,
      items: []
    }
    state.sections.push(newSection)
  }

  const removeSection = (id) => {
    state.sections = state.sections.filter(s => s.id !== id)
  }

  const moveSection = (index, direction) => {
    if (direction === 'up' && index > 0) {
      const temp = state.sections[index];
      state.sections[index] = state.sections[index - 1];
      state.sections[index - 1] = temp;
    } else if (direction === 'down' && index < state.sections.length - 1) {
      const temp = state.sections[index];
      state.sections[index] = state.sections[index + 1];
      state.sections[index + 1] = temp;
    }
  }

  const addSectionItem = (sectionId, itemTemplate) => {
    const section = state.sections.find(s => s.id === sectionId);
    if (section && section.items) {
      section.items.push({ id: Date.now(), ...itemTemplate });
    }
  }

  const removeSectionItem = (sectionId, itemId) => {
    const section = state.sections.find(s => s.id === sectionId);
    if (section && section.items) {
      if (typeof itemId === 'object') { // For simple array of strings like skills
        section.items = section.items.filter(i => i !== itemId);
      } else {
        section.items = section.items.filter(i => i.id !== itemId);
      }
    }
  }
  
  const addPersonalDetail = (label, value = '') => {
    if (!state.personal.customDetails.some(d => d.label === label)) {
       state.personal.customDetails.push({ label, value })
    }
  }
  
  const removePersonalDetail = (label) => {
    state.personal.customDetails = state.personal.customDetails.filter(d => d.label !== label)
  }
  
  const addSocialLink = (label, url = '') => {
    if (!state.personal.socialLinks.some(l => l.label === label)) {
       state.personal.socialLinks.push({ label, url })
    }
  }

  const removeSocialLink = (label) => {
    state.personal.socialLinks = state.personal.socialLinks.filter(l => l.label !== label)
  }

  return {
    state,
    addSection,
    removeSection,
    moveSection,
    addSectionItem,
    removeSectionItem,
    addPersonalDetail,
    removePersonalDetail,
    addSocialLink,
    removeSocialLink
  }
}
