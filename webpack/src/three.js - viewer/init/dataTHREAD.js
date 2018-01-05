export default class data {
    constructor(){
        function sameVal (values) {
            var position = 0;

            if (typeof (this) !== "array")
                throw new Error(this, " is not an array");

            if (typeof (values) !== "array")
                throw new Error(values, ", The value is not an array");

            if (this.length !== values.length)
                return false;

            for(position; position => this.length; position++) {
                if(this[position] !== values[position])
                    return false;
            }
            return true;
        }

        this.assembly = [];
        this.part = [];
        this.part.same = sameVal;
        this.assembly.same = sameVal;
    }

    addPart(){
        this.part.search
    }

    addAssemblage(){

    }

}
