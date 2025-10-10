import { Dam } from "../entities/damModel";
import { Level } from "../entities/levelModel";
import { ResponseModel } from "../entities/responseModel";

describe("Dam Entity", ()=>{
    it("should create an instance with given properties", ()=>{
        const dam = new Dam();
        dam.id = 1;
        dam.name = "Dam A";
        dam.location = "Location A";
        dam.capacity = 1000;
        dam.currentLevel = 500;
        dam.constructionDate = new Date("2020-01-01");
        dam.lastUpdate = new Date();

        expect(dam.id).toBe(1);
        expect(dam.name).toBe("Dam A");
        expect(dam.location).toBe("Location A");
        expect(dam.capacity).toBe(1000);
        expect(dam.currentLevel).toBe(500);
        expect(dam.constructionDate).toEqual(new Date("2020-01-01"));
        expect(dam.lastUpdate).toBeInstanceOf(Date);
    });
});

describe("Level Entity", () =>{
    it("should create an instance with given properties", ()=>{
        const level = new Level();
        level.id = 1;
        level.damId = 1;
        level.level = 500;
        level.timestamp = new Date("2023-01-01T00:00:00Z");

        expect(level.id).toBe(1);
        expect(level.damId).toBe(1);
        expect(level.level).toBe(500);
        expect(level.timestamp).toEqual(new Date("2023-01-01T00:00:00Z"));
    });
});

describe("Response Entity", () => {
    it("should create an instance with given properties", () => {
        type SampleResponse = { key: string };
        const response: ResponseModel<SampleResponse> = {
        code: 200,
        message: "Operation completed",
        response: { key: "value" },
        };

        expect(response.code).toBe(200);
        expect(response.message).toBe("Operation completed");
        expect(response.response).toEqual({ key: "value" });
    });
});