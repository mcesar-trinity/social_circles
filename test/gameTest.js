import assert from "node:assert";
import {describe, it} from "node:test";
import packageMain, { calculateHappiness, createCharacterGroups } from '../routes/game.js'; // Works

describe("getRandomTask Test", () =>{
    it('Should contain 5 unique values between 1 and x number of tasks', () => {
        let array = packageMain.getRandomTask(40);

        assert.equal(array.length, 5); 
        assert(Math.max.apply(Math, array) <= 49);
        assert(Math.min.apply(Math, array) >= 1);
    });

    it('Should contain 3 values in array between 1 and 3', () => {
        let array = packageMain.getRandomTask(3);
        console.log(array);

        assert.equal(array.length, 3);
        assert.equal(Math.max.apply(Math, array), 3);
        assert.equal(Math.min.apply(Math, array), 1);
    });

    if('Should contain empty array when class size is 0', () => {
        let array = packageMain.getRandomTask(3);

        assert(array.length == 0);
    });
});

describe("createCharacterGroups Test", () => {
    it('Given x characters that can be dvided into 3 evenly split groups', () => {
        let characters = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        let groups = createCharacterGroups(characters);
        assert.equal(groups.length, 3);

        let visited = []; 
        groups.forEach((group) => {
            assert.equal(group.length, (characters.length / 3));
            group.forEach((character) => {
                assert(!visited.includes(character));
                visited.push(character);
            })
        })
    });

    it('Given x characters that cannot be dvided into 3 evenly split groups', () => {
        let characters = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; 
        let groups = createCharacterGroups(characters);
        assert.equal(groups.length, 3);
        console.log("Group 1: " + groups[0] + "\nGroup 2: " + groups[1] + "\nGroup 3: " + groups[2]);

        let visited = []; 
        groups.forEach((group) => {
            assert(group.length >=  Math.round(characters.length / 3));
            group.forEach((character) => {
                assert(!visited.includes(character));
                visited.push(character);
            })
        })
    });

    it('Given an emptry character return three empty groups', () => {
        let characters = []; 
        let groups = createCharacterGroups(characters);
        assert.equal(groups.length, 3);

        groups.forEach((group) => {
            assert.equal(group.length, 0);
        })
    });
});

describe("calculateHappiness Test", () =>{
    it('Given a happiness_score and like returns (happiness_score + 1)', () => {
        let happiness_score = 3; 
        let new_score = calculateHappiness(happiness_score, "like");

        assert.equal(new_score, (happiness_score + 1));
    });

    it('Given a happiness_score and like returns (happiness_score + 2)', () => {
        let happiness_score = 3; 
        let new_score = calculateHappiness(happiness_score, "love");

        assert.equal(new_score, (happiness_score + 2));
    });

    it('Given a happiness_score and like returns (happiness_score - 1)', () => {
        let happiness_score = 3; 
        let new_score = calculateHappiness(happiness_score, "dislike");

        assert.equal(new_score, (happiness_score - 1));
    });

    it('Given a happiness_score and like returns (happiness_score - 2)', () => {
        let happiness_score = 3; 
        let new_score = calculateHappiness(happiness_score, "hate");

        assert.equal(new_score, (happiness_score - 2));
    });
});