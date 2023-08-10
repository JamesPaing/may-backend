import { Counter } from '../../models/counter';

class AutoIncrement {
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    async incSequence() {
        const doc = await Counter.findOneAndUpdate(
            { id: this.name },
            { $inc: { seq: 1 } },
            {
                new: true,
                upsert: true,
            }
        );

        return doc.seq;
    }

    async decSequence() {
        const doc = await Counter.findOneAndUpdate(
            { id: this.name },
            { $inc: { seq: -1 } },
            {
                new: true,
                upsert: true,
            }
        );

        return doc.seq;
    }

    static async getCode(name: string) {
        let code = '';

        const counter: { seq: string } | null = await Counter.findOne({
            id: name,
        });

        if (!counter) {
            code = `${name.charAt(0).toUpperCase()}000001`;

            return code;
        }

        const currentCount = counter!.seq;
        const currentCountNum = Number(currentCount);
        const newCount = currentCountNum + 1;

        switch (newCount.toString().length) {
            case 1:
                code = `${name.charAt(0).toUpperCase()}00000${newCount}`;
                break;
            case 2:
                code = `${name.charAt(0).toUpperCase()}0000${newCount}`;
                break;
            case 3:
                code = `${name.charAt(0).toUpperCase()}000${newCount}`;
                break;
            case 4:
                code = `${name.charAt(0).toUpperCase()}00${newCount}`;
                break;
            case 5:
                code = `${name.charAt(0).toUpperCase()}0${newCount}`;
                break;
            case 6:
                code = `${name.charAt(0).toUpperCase()}${newCount}`;
                break;
            default:
                break;
        }

        return code;
    }
}

export default AutoIncrement;
