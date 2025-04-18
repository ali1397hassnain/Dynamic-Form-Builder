import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  fields: [],
  sections: [],
  conditionalLogic: [],
  formData: {},
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    addField: (state, action) => {
      const { field, sectionId } = action.payload;
      
      const addToSection = (sections, targetId) => {
        return sections.some(section => {
          if (section.id === targetId) {
            section.fields.push(field);
            return true;
          }
          if (section.sections && addToSection(section.sections, targetId)) {
            return true;
          }
          return false;
        });
      };

      if (sectionId && !addToSection(state.sections, sectionId)) {
        console.warn(`Section ${sectionId} not found, adding to root`);
        state.fields.push(field);
      } else if (!sectionId) {
        state.fields.push(field);
      }
    },
    setFormData: (state, action) => {
      state.formData = action.payload
    },
    addSection: (state, action) => {
      const newSection = {
        id: `section-${Date.now()}`,
        title: action.payload.title,
        fields: [],
        sections: [],
        parentId: action.payload.parentId || null
      };
      if (action.payload.parentId) {
        const parentSection = state.sections.find(s => s.id === action.payload.parentId);
        if (parentSection) {
          parentSection.sections.push(newSection);
        }
      } else {
        state.sections.push(newSection);
      }
    },
    addCondition: (state, action) => {
      state.conditionalLogic.push(action.payload);
    },
  },
});

export const { addField, addSection, addCondition, setFormData } = formSlice.actions;
export default formSlice.reducer;