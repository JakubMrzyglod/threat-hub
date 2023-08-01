export const mixIds = (
  assertIds: number[],
  vulnerabilityIds: number[],
  platformDetails: { name: string }
) => {
  const result = [];
  for (let assertIndex = 0; assertIndex < assertIds.length; assertIndex++) {
    for (
      let vulnerabilityIndex = 0;
      vulnerabilityIndex < vulnerabilityIds.length;
      vulnerabilityIndex++
    ) {
      const assertId = assertIds[assertIndex];
      const vulnerabilityId = vulnerabilityIds[vulnerabilityIndex];
      result.push({ ...platformDetails, assertId, vulnerabilityId });
    }
  }

  return result;
};
