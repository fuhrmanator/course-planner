import {describe, expect, test} from '@jest/globals';
import {DSLActivity, DSLCourse, DSLDateRef, DSLTime, DSLTimeType, DSLTimeUnit} from "@/components/model/interfaces/dsl";
import {
    dateOffsetAsDSL, getDateAt, getDateIndex, getDateOffset, getDateRef, getDateType, getDateUnit, instantiateDSL,
    makeDSLRelativeToClosestDate, parseAndCast, parseDSL,
    recreateDSL
} from "@/components/controller/util/dsl/dslOperations";
import {DSL_TIME_UNIT_TO_MS} from "@/components/model/ressource/dslRessource";
import {CourseEvent, EventType} from "@/components/model/interfaces/courseEvent";
const peg = require('pegjs');
const fs = require('fs');

// read grammar and create parser dynamically
const grammar = fs.readFileSync(require.resolve('@/components/controller/util/dsl/grammar/dsl.pegjs'), 'utf-8');
const parser = peg.generate(grammar);

const expectDSLCourseEqual = (parsedDSL:DSLCourse|undefined, type:string, i:number, modifier:string):void => {
    expect(parsedDSL).toBeDefined()
    expect(parsedDSL!.type).toEqual(type);
    expect(parsedDSL!.i).toEqual(i);
    expect(parsedDSL!.modifier).toBeDefined();
    expect(parsedDSL!.modifier).toEqual(modifier);
}

const expectDSLTimeEqual = (parsedDSL: DSLTime|undefined, modifier:string, n:number, unit:string): void => {
    expect(parsedDSL).toBeDefined();
    expect(parsedDSL!.modifier).toBeDefined()
    expect(parsedDSL!.modifier).toEqual(modifier)
    expect(parsedDSL!.number).toBeDefined()
    expect(parsedDSL!.number).toEqual(n)
    expect(parsedDSL!.type).toBeDefined()
    expect(parsedDSL!.type).toEqual(unit)
}

describe("DSL Parsing tests", () => {
    test("Quiz start and end time", () => {
        const parsed  = parser.parse("Quiz1 Seminar1Finish Seminar2Start" +
            "\nQuiz2 Seminar2Finish Seminar3Start-30m")[1] as DSLActivity[];

        expect(parsed.length).toEqual(2)

        expect(parsed[0].type).toEqual("Quiz");
        expect(parsed[0].i).toEqual(1);
        expectDSLCourseEqual(parsed[0].close, "Seminar", 2, "Start")
        expectDSLCourseEqual(parsed[0].open, "Seminar", 1, "End")

        expect(parsed[1].type).toEqual("Quiz");
        expect(parsed[1].i).toEqual(2);
        expectDSLCourseEqual(parsed[1].open, "Seminar", 2, "End")
        expectDSLCourseEqual(parsed[1].close, "Seminar", 3, "Start")
        expectDSLTimeEqual(parsed[1].close!.time, "-", 30, "m")

    });

    test("Homework start and end time", () => {
        const parsed  = parser.parse("Homework1 Seminar1Finish Practicum2Start Laboratory3Start-30m\nHomework2 Seminar1Finish-10h Seminar3Start+4d Seminar4Start+1w")[1] as DSLActivity[];

        expect(parsed.length).toEqual(2)

        expect(parsed[0].type).toEqual("Homework");
        expect(parsed[0].i).toEqual(1);
        expectDSLCourseEqual(parsed[0].open, "Seminar", 1, "End")
        expectDSLCourseEqual(parsed[0].due, "Practicum", 2, "Start")
        expectDSLCourseEqual(parsed[0].cutoff, "Laboratory", 3, "Start")
        expectDSLTimeEqual(parsed[0].cutoff!.time, "-", 30, "m")

        expect(parsed[1].type).toEqual("Homework");
        expect(parsed[1].i).toEqual(2);
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
            expect(recreateDSL( parsed[i])).toEqual(originalDSL[i])
        }
    });

    test("Should recreate homework DSL", () => {
        const originalDSL = ["Homework1 Seminar1End Practicum2Start Laboratory3Start-30m","Homework2 Seminar1End-10h Seminar3Start+4d Seminar4Start+1w"]
        const parsed  = parser.parse(originalDSL.join("\n"))[1] as DSLActivity[];

        for (let i=0; i<parsed.length; i++) {
            expect(recreateDSL( parsed[i])).toEqual(originalDSL[i])
        }
    });
});

describe("DSL date offset", () => {
    test("Should represent positive date offset", () => {
        const multiplicity = 10;
        // positive
        for (const dslTimeUnit in DSL_TIME_UNIT_TO_MS) {
            let dslTimeOffset = dateOffsetAsDSL(new Date(0), new Date(DSL_TIME_UNIT_TO_MS[dslTimeUnit as DSLTimeUnit] * multiplicity));
            expect(dslTimeOffset).toEqual(`+${multiplicity}${dslTimeUnit}`)
        }
    });
    test("Should represent negative date offset", () => {
        const multiplicity = -10
        // negative
        for (const dslTimeUnit in DSL_TIME_UNIT_TO_MS) {
            let dslTimeOffset = dateOffsetAsDSL(new Date(0), new Date(DSL_TIME_UNIT_TO_MS[dslTimeUnit as DSLTimeUnit] * multiplicity));
            expect(dslTimeOffset).toEqual(`${multiplicity}${dslTimeUnit}`)
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
            type: EventType.Seminar,
            dsl: instantiateDSL(EventType.Seminar)
        },
        {
            uid: '2',
            title: 'Event 2',
            start: new Date('2022-01-01T11:00:00'),
            end: new Date('2022-01-01T12:00:00'),
            type: EventType.Seminar,
            dsl: instantiateDSL(EventType.Seminar)
        },
        {
            uid: '3',
            title: 'Event 3',
            start: new Date('2022-01-01T14:00:00'),
            end: new Date('2022-01-01T16:00:00'),
            type: EventType.Seminar,
            dsl: instantiateDSL(EventType.Seminar)
        }
    ];

    it('should return correct DSL string when ref date is in-between two events', () => {
        const ref = new Date('2022-01-01T13:00:00');
        const expectedDSL = 'Seminar2End+1h';
        const actualDSL = makeDSLRelativeToClosestDate(ref, events);
        expect(actualDSL).toEqual(expectedDSL);
    });

    it('should return correct DSL string when ref date is exactly at the start of an event', () => {
        const ref = new Date('2022-01-01T09:00:00');
        const expectedDSL = 'Seminar1Start';
        const actualDSL = makeDSLRelativeToClosestDate(ref, events);
        expect(actualDSL).toEqual(expectedDSL);
    });

    it('should return correct DSL string when ref date is exactly at the end of an event', () => {
        const ref = new Date('2022-01-01T16:00:00');
        const expectedDSL = 'Seminar3End';
        const actualDSL = makeDSLRelativeToClosestDate(ref, events);
        expect(actualDSL).toEqual(expectedDSL);
    });

    it('should return correct DSL string when only one event is present', () => {
        const ref = new Date('2022-01-01T13:00:00');
        const expectedDSL = 'Seminar1End+3h';
        const actualDSL = makeDSLRelativeToClosestDate(ref, [events[0]]);
        expect(actualDSL).toEqual(expectedDSL);
    });
});

describe('DSL statement extraction', () => {
    it('Should return correct course type', () => {
        expect(getDateType("Seminar1End")).toEqual(EventType.Seminar);
        expect(getDateType("Laboratory2End+10m")).toEqual(EventType.Laboratory);
        expect(getDateType("Practicum2@23:33")).toEqual(EventType.Practicum);
    });

    it('Should return correct course number', () => {
        expect(getDateIndex("Seminar1End")).toEqual(1);
        expect(getDateIndex("Laboratory2End+10m")).toEqual(2);
        expect(getDateIndex("Practicum3@23:33")).toEqual(3);
    });

    it('Should return correct at', () => {
        expect(getDateAt("Seminar1@23:33")).toEqual("23:33");
        expect(getDateAt("Laboratory2End+10m@00:00")).toEqual("00:00");
        expect(getDateAt("Practicum3Start@12:00")).toEqual("12:00");
        expect(getDateAt("Practicum3Start")).toBeUndefined();
    });

    it('Should return correct offset', () => {
        expect(getDateOffset("Seminar1+1m")).toEqual(1);
        expect(getDateOffset("Laboratory2End+10m@00:00")).toEqual(10);
        expect(getDateOffset("Practicum3Start-1d@12:00")).toEqual(-1);
        expect(getDateOffset("Practicum3Start")).toEqual(0);
    });

    it('Should return correct offset unit', () => {
        expect(getDateUnit("Seminar1+1m")).toEqual(DSLTimeUnit.Minute);
        expect(getDateUnit("Laboratory2+10h@00:00")).toEqual(DSLTimeUnit.Hour);
        expect(getDateUnit("Practicum3Start-1d@12:00")).toEqual(DSLTimeUnit.Day);
        expect(getDateUnit("Practicum3Start+1w@12:00")).toEqual(DSLTimeUnit.Week);
        expect(getDateUnit("Practicum3Start")).toBeUndefined();
    });

    it('Should return correct date ref', () => {
        expect(getDateRef("Seminar1+1m")).toBeUndefined()
        expect(getDateRef("Laboratory2End+10h@00:00")).toEqual(DSLDateRef.End);
        expect(getDateRef("Practicum3Start-1d@12:00")).toEqual(DSLDateRef.Start);
        expect(getDateRef("Practicum3Start")).toEqual(DSLDateRef.Start);
    });
});

describe('DSL statement recreation', () => {
    it('Should recreate DSL statements', () => {
        expect(recreateDSL(parseAndCast("Quiz1 Seminar1End Seminar2Start-1d")[0])).toEqual("Quiz1 Seminar1End Seminar2Start-1d");
        expect(recreateDSL(parseAndCast("Quiz2 Seminar1 Seminar2Start")[0])).toEqual("Quiz2 Seminar1 Seminar2Start");
        expect(recreateDSL(parseAndCast("Quiz3 Seminar3Start+1w Seminar2Start+2d")[0])).toEqual("Quiz3 Seminar3Start+1w Seminar2Start+2d");
        expect(recreateDSL(parseAndCast("Quiz4 Seminar2Start+3h Seminar5End+4m")[0])).toEqual("Quiz4 Seminar2Start+3h Seminar5End+4m");
        expect(recreateDSL(parseAndCast("Quiz5 Seminar1 Seminar2Start")[0])).toEqual("Quiz5 Seminar1 Seminar2Start");
        expect(recreateDSL(parseAndCast("Quiz6 Seminar1@12:34 Seminar2End@23:12")[0])).toEqual("Quiz6 Seminar1@12:34 Seminar2End@23:12");
        expect(recreateDSL(parseAndCast("Quiz7 Seminar1End+1m@00:00 Seminar2Start-1m@00:01")[0])).toEqual("Quiz7 Seminar1End+1m@00:00 Seminar2Start-1m@00:01");
        expect(recreateDSL(parseAndCast("Quiz8 Seminar1+1m@01:00 Seminar2-1m@02:00")[0])).toEqual("Quiz8 Seminar1+1m@01:00 Seminar2-1m@02:00");
        expect(recreateDSL(parseAndCast("Homework1 Seminar1End Seminar1+1m@01:00 Seminar2Start-1d")[0])).toEqual("Homework1 Seminar1End Seminar1+1m@01:00 Seminar2Start-1d");
    });
});

