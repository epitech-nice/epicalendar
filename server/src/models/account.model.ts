import { Schema, model, Types } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Day } from "./day.model";

const AccountSchema = new Schema(
    {
        // Connection information
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        created_at: {
            type: Date,
            default: Date.now,
            required: true,
        },

        // Personal information
        first_name: {
            type: String,
            required: true,
        },
        last_name: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["student", "aer", "admin"],
            default: "student",
            required: true,
        },
        description: {
            type: String,
            default: "",
        },
        photo: {
            type: String,
            default: "/default-user.jpg",
        },

        // Preferences
        day: {
            type: String,
            enum: [
                "",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
            ],
            default: "",
        },
        room: {
            type: String,
            default: "",
        },
    },
    {
        id: false,
    },
);

export const Account = model("Account", AccountSchema);

export async function formatAccountFields(
    first_name: string | null,
    last_name: string,
    password: string,
): Promise<{
    first_name: string | null;
    last_name: string | null;
    password: string | null;
}> {
    const formattedFirstName = !first_name
        ? null
        : first_name
              .split(/[-\s]/)
              .map(
                  (part: string) =>
                      part.charAt(0).toUpperCase() +
                      part.slice(1).toLowerCase(),
              )
              .join(first_name.includes("-") ? "-" : " ");
    const formattedLastName = !first_name ? null : last_name.toUpperCase();
    const formattedPassword = !first_name
        ? null
        : await bcrypt.hash(password, 10);

    return {
        first_name: formattedFirstName,
        last_name: formattedLastName,
        password: formattedPassword,
    };
}

export function generateToken(
    id: Types.ObjectId,
    email: string,
    role: string,
): string {
    return jwt.sign(
        { id: id, email: email, role: role },
        process.env.JWT_SECRET as string,
        { expiresIn: "7d" },
    );
}

function msToHHMM(ms: number): string {
    const totalMinutes = Math.floor(ms / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(1, "0")}h${minutes.toString().padStart(2, "0")}`;
}

export async function addGuardTime(account: any): Promise<any> {
    const guard_time: { [key: string]: number } = {
        monday: 0,
        tuesday: 0,
        wednesday: 0,
        thursday: 0,
        friday: 0,
        saturday: 0,
        sunday: 0,
        total: 0,
    };

    const days = await Day.find();
    for (const day of days) {
        if (day.aers.includes(account._id)) {
            const day_of_week = day.date
                .toLocaleDateString("en-US", { weekday: "long" })
                .toLowerCase();
            if (guard_time[day_of_week] !== undefined) {
                let duration = 0;
                if (day.end === null || day.end === undefined) {
                    duration = day.close.getTime() - day.start.getTime();
                } else {
                    if (day.end.getTime() < day.start.getTime()) {
                        // If the end time is before the start time, it means the guard ended the shift the next day
                        duration =
                            day.end.getTime() -
                            day.start.getTime() +
                            24 * 60 * 60 * 1000;
                    } else {
                        duration = day.end.getTime() - day.start.getTime();
                    }
                }
                guard_time[day_of_week] += duration;
                guard_time.total += duration;
            }
        }
    }

    account.guard_time = {
        monday: msToHHMM(guard_time.monday),
        tuesday: msToHHMM(guard_time.tuesday),
        wednesday: msToHHMM(guard_time.wednesday),
        thursday: msToHHMM(guard_time.thursday),
        friday: msToHHMM(guard_time.friday),
        saturday: msToHHMM(guard_time.saturday),
        sunday: msToHHMM(guard_time.sunday),
        total: msToHHMM(guard_time.total),
    };
}
