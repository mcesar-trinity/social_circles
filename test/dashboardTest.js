// Import dependencies
import assert from "node:assert";
import { describe, it } from "node:test";
import { isAdmin } from "../routes/dashboard.js";
import { hslToHex, updateLivePreview, updateChoices } from "../routes/dashboard_functions.js";
import { JSDOM } from "jsdom";

// Set up a fake DOM environment
const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`);
global.window = dom.window;
global.document = dom.window.document;

// Helper function for isAdmin middleware
function createMockResponse() {
    const res = {};
    res.status = function(code) {
        this.statusCode = code;
        return this;
    };
    res.send = function(message) {
        this.message = message;
        return this;
    };
    return res;
}

describe("isAdmin Middleware Test", () => {
    it('Should call next if user is admin', () => {
        const req = { session: { user: { role: 'admin' } } };
        const res = createMockResponse();
        
        let nextCalled = false;
        isAdmin(req, res, () => {
            nextCalled = true;
        });

        assert.equal(nextCalled, true);
    });

    it('Should respond with 403 if user is not admin', () => {
        const req = { session: { user: { role: 'user' } } };
        const res = createMockResponse();
        let nextCalled = false;

        isAdmin(req, res, () => {
            nextCalled = true;
        });

        assert.equal(nextCalled, false);
        assert.equal(res.statusCode, 403);
        assert.equal(res.message, 'Forbidden');
    });

    it('Should respond with 403 if session is missing', () => {
        const req = {session:{}}; // No session
        const res = createMockResponse();
        let nextCalled = false;

        isAdmin(req, res, () => {
            nextCalled = true;
        });

        assert.equal(nextCalled, false);
        assert.equal(res.statusCode, 403);
        assert.equal(res.message, 'Forbidden');
    });
});

describe("hslToHex Test", () => {
    it("Should convert basic HSL (0, 100%, 50%) to red (#ff0000)", () => {
        const hex = hslToHex(0, 100, 50);
        assert.equal(hex, "#ff0000");
    });

    it("Should convert HSL (120, 100%, 50%) to green (#00ff00)", () => {
        const hex = hslToHex(120, 100, 50);
        assert.equal(hex, "#00ff00");
    });

    it("Should convert HSL (240, 100%, 50%) to blue (#0000ff)", () => {
        const hex = hslToHex(240, 100, 50);
        assert.equal(hex, "#0000ff");
    });

    it("Should handle edge cases like (0, 0%, 0%) as black (#000000)", () => {
        const hex = hslToHex(0, 0, 0);
        assert.equal(hex, "#000000");
    });
});

describe("updateLivePreview Test", () => {
    it("Should update the background color of profile view", () => {
        // Create DOM elements
        const profileCircle = document.createElement('div');
        const profileUsername = document.createElement('div');
        const accountHeader = document.createElement('div');

        document.body.appendChild(profileCircle);
        document.body.appendChild(profileUsername);
        document.body.appendChild(accountHeader);

        updateLivePreview(180, profileCircle, profileUsername, accountHeader);

        assert(profileCircle.style.backgroundColor !== '');
        assert(profileUsername.style.color !== '');
    });

    it("Should gracefully do nothing if value is undefined", () => {
        const profileCircle = document.createElement('div');
        const profileUsername = document.createElement('div');
        const accountHeader = document.createElement('div');

        document.body.appendChild(profileCircle);
        document.body.appendChild(profileUsername);
        document.body.appendChild(accountHeader);

        assert.doesNotThrow(() => {
            updateLivePreview(undefined, profileCircle, profileUsername, accountHeader);
        });
    });
});

// Mock Choices class
class MockChoices {
    constructor(selectElement, options) {
        this.selectElement = selectElement;
        this.options = options;
        this.selectedValues = [];
        this.choices = [];
    }

    getValue() {
        return this.selectedValues;
    }

    removeActiveItems() {
        this.selectedValues = [];
    }

    clearChoices() {
        this.choices = [];
    }

    setChoices(choicesArray) {
        this.choices = choicesArray;
    }

    select(values) {
        this.selectedValues = values;
    }
}

describe("updateChoices Test", () => {
    it("Should disable already selected values across selects", () => {
        // Set up fake selects
        const loves = document.createElement('select');
        loves.id = 'characterLoves';
        loves.innerHTML = `
            <option value="cooking">Cooking</option>
            <option value="reading">Reading</option>
        `;

        const likes = document.createElement('select');
        likes.id = 'characterLikes';
        likes.innerHTML = `
            <option value="cooking">Cooking</option>
            <option value="hiking">Hiking</option>
        `;

        document.body.appendChild(loves);
        document.body.appendChild(likes);

        // Save all original options
        const allOptions = {
            characterLoves: [
                { value: "cooking", label: "Cooking" },
                { value: "reading", label: "Reading" }
            ],
            characterLikes: [
                { value: "cooking", label: "Cooking" },
                { value: "hiking", label: "Hiking" }
            ]
        };

        const selects = [loves, likes];

        // Mock Choices instances
        const lovesChoices = new MockChoices(loves);
        const likesChoices = new MockChoices(likes);

        // Select "Cooking" in loves
        lovesChoices.select(["cooking"]);

        // Call updateChoices
        updateChoices([lovesChoices, likesChoices], allOptions, selects);

        // Test: "Cooking" should be selected in loves
        assert.deepEqual(lovesChoices.choices.find(c => c.value === "cooking").selected, true);

        // Test: "Cooking" should be disabled in likes
        assert.deepEqual(likesChoices.choices.find(c => c.value === "cooking").disabled, true);

        // Test: "Hiking" should still be available
        assert.deepEqual(likesChoices.choices.find(c => c.value === "hiking").disabled, false);
    });

    it("Should not crash if no values are selected", () => {
        const loves = document.createElement('select');
        loves.id = 'characterLoves';
        loves.innerHTML = `
            <option value="cooking">Cooking</option>
            <option value="reading">Reading</option>
        `;

        const likes = document.createElement('select');
        likes.id = 'characterLikes';
        likes.innerHTML = `
            <option value="cooking">Cooking</option>
            <option value="hiking">Hiking</option>
        `;

        document.body.appendChild(loves);
        document.body.appendChild(likes);

        const allOptions = {
            characterLoves: [
                { value: "cooking", label: "Cooking" },
                { value: "reading", label: "Reading" }
            ],
            characterLikes: [
                { value: "cooking", label: "Cooking" },
                { value: "hiking", label: "Hiking" }
            ]
        };

        const selects = [loves, likes];

        const lovesChoices = new MockChoices(loves);
        const likesChoices = new MockChoices(likes);

        // No selections made
        updateChoices([lovesChoices, likesChoices], allOptions, selects);

        // Test: nothing is disabled
        assert.equal(lovesChoices.choices.some(c => c.disabled), false);
        assert.equal(likesChoices.choices.some(c => c.disabled), false);
    });
});
