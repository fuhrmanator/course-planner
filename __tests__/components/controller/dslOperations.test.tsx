import {describe, expect, test} from '@jest/globals';
import {DSLActivity, DSLCourse, DSLTime, DSLTimeType, DSLTimeUnit} from "@/components/model/interfaces/dsl";
import {
    dateOffsetAsDSL,
    makeDSLRelativeToClosestDate,
    recreateDSL
} from "@/components/controller/util/dsl/dslOperations";
import {DSL_TIME_UNIT_TO_MS} from "@/components/model/ressource/dslRessource";
import {CourseEvent, EventType} from "@/components/model/interfaces/courseEvent";
const peg = require('pegjs');
const fs = require('fs');

// read grammar and create parser dynamically
const grammar = fs.readFileSync(require.resolve('src/components/controller/util/dsl/grammar/dsl.pegjs'), 'utf-8');
const parser = peg.generate(grammar);

const expectDSLCourseEqual = (parsedDSL:DSLCourse|undefined, type:string, i:number, modifier:string):void => {
    expect(parsedDSL).toBeDefined()
    expect(parsedDSL!.type).toBe(type);
    expect(parsedDSL!.i).toBe(i);
    expect(parsedDSL!.modifier).toBeDefined();
    expect(parsedDSL!.modifier).toBe(modifier);
}

const expectDSLTimeEqual = (parsedDSL: DSLTime|undefined, modifier:string, n:number, unit:string): void => {
    expect(parsedDSL).toBeDefined();
    expect(parsedDSL!.modifier).toBeDefined()
    expect(parsedDSL!.modifier).toBe(modifier)
    expect(parsedDSL!.number).toBeDefined()
    expect(parsedDSL!.number).toBe(n)
    expect(parsedDSL!.type).toBeDefined()
    expect(parsedDSL!.type).toBe(unit)
}

describe("DSL Parsing tests", () => {
    test("Quiz start and end time", () => {
        const parsed  = parser.parse("Quiz1 Seminar1Finish Seminar2Start\nQuiz2 Seminar2Finish Seminar3Start-30m")[1] as DSLActivity[];

        expect(parsed.length).toBe(2)

        expect(parsed[0].type).toBe("Quiz");
        expect(parsed[0].i).toBe(1);
        expectDSLCourseEqual(parsed[0].close, "Seminar", 2, "Start")
        expectDSLCourseEqual(parsed[0].open, "Seminar", 1, "End")

        expect(parsed[1].type).toBe("Quiz");
        expect(parsed[1].i).toBe(2);
        expectDSLCourseEqual(parsed[1].open, "Seminar", 2, "End")
        expectDSLCourseEqual(parsed[1].close, "Seminar", 3, "Start")
        expectDSLTimeEqual(parsed[1].close!.time, "-", 30, "m")

    });

    test("Homework start and end time", () => {
        const parsed  = parser.parse("Homework1 Seminar1Finish Practicum2Start Laboratory3Start-30m\nHomework2 Seminar1Finish-10h Seminar3Start+4d Seminar4Start+1w")[1] as DSLActivity[];

        expect(parsed.length).toBe(2)

        expect(parsed[0].type).toBe("Homework");
        expect(parsed[0].i).toBe(1);
        expectDSLCourseEqual(parsed[0].open, "Seminar", 1, "End")
        expectDSLCourseEqual(parsed[0].due, "Practicum", 2, "Start")
        expectDSLCourseEqual(parsed[0].cutoff, "Laboratory", 3, "Start")
        expectDSLTimeEqual(parsed[0].cutoff!.time, "-", 30, "m")

        expect(parsed[1].type).toBe("Homework");
        expect(parsed[1].i).toBe(2);
        expectDSLCourseEqual(parsed[1].open, "Seminar", 1, "End")
        expectDSLTimeEqual(parsed[1].open!.time, "-", 10, "h")
        expectDSLCourseEqual(parsed[1].due, "Seminar", 3, "Start")
        expectDSLTimeEqual(parsed[1].due!.time, "+", 4, "d")
        expectDSLCourseEqual(parsed[1].cutoff, "Seminar", 4, "Start")
        expectDSLTimeEqual(parsed[1].cutoff!.time, "+", 1, "w")

    });
});

describe("DSL recreation using DSL output", () => {
    test("Should recreate quiz DSL", () => {
        const originalDSL = ["Quiz1 Seminar1End Seminar2Start","Quiz2 Seminar2End+1h Seminar3Start-30m"]
        const parsed  = parser.parse(originalDSL.join("\n"))[1] as DSLActivity[];

        for (let i=0; i<parsed.length; i++) {
            expect(recreateDSL( parsed[i])).toBe(originalDSL[i])
        }
    });

    test("Should recreate homework DSL", () => {
        const originalDSL = ["Homework1 Seminar1End Practicum2Start Laboratory3Start-30m","Homework2 Seminar1End-10h Seminar3Start+4d Seminar4Start+1w"]
        const parsed  = parser.parse(originalDSL.join("\n"))[1] as DSLActivity[];

        for (let i=0; i<parsed.length; i++) {
            expect(recreateDSL( parsed[i])).toBe(originalDSL[i])
        }
    });
});

describe("DSL date offset", () => {
    test("Should represent positive date offset", () => {
        const multiplicity = 10;
        // positive
        for (const dslTimeUnit in DSL_TIME_UNIT_TO_MS) {
            let dslTimeOffset = dateOffsetAsDSL(new Date(0), new Date(DSL_TIME_UNIT_TO_MS[dslTimeUnit as DSLTimeUnit] * multiplicity));
            expect(dslTimeOffset).toBe(`+${multiplicity}${dslTimeUnit}`)
        }
    });
    test("Should represent negative date offset", () => {
        const multiplicity = -10
        // negative
        for (const dslTimeUnit in DSL_TIME_UNIT_TO_MS) {
            let dslTimeOffset = dateOffsetAsDSL(new Date(0), new Date(DSL_TIME_UNIT_TO_MS[dslTimeUnit as DSLTimeUnit] * multiplicity));
            expect(dslTimeOffset).toBe(`${multiplicity}${dslTimeUnit}`)
        }

    });

});

describe('Create DSL relative to the closest given event', () => {
    const events: CourseEvent[] = [
        {
            uid: '1',
            title: 'Event 1',
            start: new Date('2022-01-01T09:00:00'),
            end: new Date('2022-01-01T10:00:00'),
            type: EventType.Seminar
        },
        {
            uid: '2',
            title: 'Event 2',
            start: new Date('2022-01-01T11:00:00'),
            end: new Date('2022-01-01T12:00:00'),
            type: EventType.Seminar
        },
        {
            uid: '3',
            title: 'Event 3',
            start: new Date('2022-01-01T14:00:00'),
            end: new Date('2022-01-01T16:00:00'),
            type: EventType.Seminar
        }
    ];

    it('should return correct DSL string when ref date is in-between two events', () => {
        const ref = new Date('2022-01-01T13:00:00');
        const expectedDSL = '2SeminarEnd+1h';
        const actualDSL = makeDSLRelativeToClosestDate(ref, events);
        expect(actualDSL).toEqual(expectedDSL);
    });

    it('should return correct DSL string when ref date is exactly at the start of an event', () => {
        const ref = new Date('2022-01-01T09:00:00');
        const expectedDSL = '1SeminarStart';
        const actualDSL = makeDSLRelativeToClosestDate(ref, events);
        expect(actualDSL).toEqual(expectedDSL);
    });

    it('should return correct DSL string when ref date is exactly at the end of an event', () => {
        const ref = new Date('2022-01-01T16:00:00');
        const expectedDSL = '3SeminarEnd';
        const actualDSL = makeDSLRelativeToClosestDate(ref, events);
        expect(actualDSL).toEqual(expectedDSL);
    });

    it('should return correct DSL string when only one event is present', () => {
        const ref = new Date('2022-01-01T13:00:00');
        const expectedDSL = '1SeminarEnd+3h';
        const actualDSL = makeDSLRelativeToClosestDate(ref, [events[0]]);
        expect(actualDSL).toEqual(expectedDSL);
    });
});

