/**
*	Jean-Adrien Domage
*	jeanadrien.domage@epitech.eu
*
*	Copyright Plum, all right reserved
*/

let assert = require("assert");
let converter = require("./convertisseur");

let rsc_path = "/Users/jean-adriendomage/devops/dataBank/servo.stp";
let rsc_CUBE = "/Users/jean-adriendomage/devops/dataSet/box-cube-10x10mm-1.snapshot.16/BOX\ CUBE\ 10x10mm.obj";
let rsc_IPHONE = "/Users/jean-adriendomage/devops/dataSet/4nkzbt4i2fb4-Iphone_8/Iphone\ 8.obj";
let rsc_MOTOR = "/Users/jean-adriendomage/devops/dataSet/7-cylinder-rotary-engine-1.snapshot.9/MOTORGRUPPE.stl";
let rsc_native = "cube.native";

describe("Converter Unit Test", function () {

    it ("None existing File", function () {
        let geometry = null;
        try {
            geometry = converter.exec("lajnlajnzdl");
        }
        catch (e) {
            console.log(e);
            assert.ok(false);
            geometry = null;
        }
    });

    it ("Native Module : cube.native", function () {
        let geometry = null;
        try {
            geometry = converter.exec(rsc_native);
        }
        catch (e) {
            console.log(e);
            assert.ok(false);
            geometry = null;
        }
    });

    it ("Native Module : cube.native", function () {
        let geometry = null;
        try {
            geometry = converter.exec(rsc_CUBE);
        }
        catch (e) {
            console.log(e);
            assert.ok(false);
            geometry = null;
        }
    });
});
