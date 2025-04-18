import { createSelector } from "@reduxjs/toolkit";


export const selectVisibleFormData = createSelector(
  [
    (state) => state.form.fields,
    (state) => state.form.sections,
    (state) => state.form.conditionalLogic,
    (_, formValues) => formValues || {},
  ],
  (rootFields, rootSections, conditions, formValues) => {
    const evaluateCondition = (condition, formValues) => {
      const sourceValue = formValues[condition.sourceId];
      
      // Handle missing values
      if (sourceValue === undefined || sourceValue === '') {
        return false; // Treat missing values as not matching
      }
    
      // Numeric comparisons
      if (['lessThan', 'greaterThan'].includes(condition.operator)) {
        return condition.operator === 'lessThan' 
          ? Number(sourceValue) < Number(condition.value)
          : Number(sourceValue) > Number(condition.value);
      }
    
      // String comparisons
      switch (condition.operator) {
        case 'equals': return sourceValue == condition.value;
        case 'notEquals': return sourceValue != condition.value;
        case 'contains': return String(sourceValue).includes(condition.value);
        default: return true;
      }
    };

    const shouldShowItem = (itemId) => {
      const itemConditions = conditions.filter(c => c.targetId === itemId);
      return itemConditions.every(condition => {
        const conditionMet = evaluateCondition(condition, formValues);
        return condition.action === 'show' ? conditionMet : !conditionMet;
      });
    };

    const processFields = (fields) =>
      fields.filter((field) => shouldShowItem(field.id));

    const processSections = (sections) => {
      return sections
        .filter((section) => shouldShowItem(section.id))
        .map((section) => ({
          ...section,
          fields: processFields(section.fields),
          sections: processSections(section.sections),
        }));
    };


    return {
      fields: processFields(rootFields),
      sections: processSections(rootSections),
    };
  }
);

export const createFieldLabelLookup = createSelector(
  [(state) => state.form.fields, (state) => state.form.sections],
  (fields, sections) => {
    const lookup = {};

    // Add root fields
    fields.forEach((field) => {
      lookup[field.id] = field.label;
    });

    // Recursively add section fields
    const processSections = (sections) => {
      sections.forEach((section) => {
        section.fields.forEach((field) => {
          lookup[field.id] = field.label;
        });
        if (section.sections.length > 0) {
          processSections(section.sections);
        }
      });
    };

    processSections(sections);
    return lookup;
  }
);
