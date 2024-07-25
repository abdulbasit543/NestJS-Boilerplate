import { WelcomeEmailPayload } from '../types';

export default ({ name, link }: WelcomeEmailPayload) => {
    return `
        <h1>Welcome ${name}</h1>
        <h4>Please click <a href="${link}" target="_blank">here</a> to go to the dashboard</h4>
    `;
};
