import { forgeSkillFromSource } from "./index.js";

const source = {
  title: "AWR397 Cybersecurity for Everyone",
  type: "course",
  description: "The purpose of this course is to provide students a general understanding of cybersecurity risk and best practices for protecting themselves and their devices from cyber attacks. This course introduces the basics of protecting computers, data, accounts, and devices through safe habits, awareness, and practical readiness."
};

const result = forgeSkillFromSource(source);
console.log(JSON.stringify(result, null, 2));
