import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Pencil1Icon } from "@radix-ui/react-icons";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { toast } from "@/hooks/use-toast";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";

type EventData = {
    name: string;
    startTime: string;
    endTime: string;
    description: string;
    day: string;
    type: string;
};

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentDay, setCurrentDay] = useState<number | null>(null);
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [formData, setFormData] = useState<EventData>({
        name: "",
        startTime: "",
        endTime: "",
        description: "",
        day: "",
        type: "",
    });

    const [events, setEvents] = useState<EventData[]>([]);
    const [eventType, setEventType] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [editingEvent, setEditingEvent] = useState<EventData | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const loadEventsFromStorage = () => {
        const storedEvents = localStorage.getItem("events");
        if (storedEvents) {
            setEvents(JSON.parse(storedEvents));
        }
    };

    useEffect(() => {
        loadEventsFromStorage();
    }, []);

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getStartDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    const generateCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const startDay = getStartDayOfMonth(year, month);
        const calendarDays = [];

        for (let i = 0; i < startDay; i++) {
            calendarDays.push(null);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            calendarDays.push(day);
        }

        return calendarDays;
    };

    const handlePrevMonth = () => {
        setCurrentDate(
            (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
        );
    };

    const handleNextMonth = () => {
        setCurrentDate(
            (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
        );
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const getEventsForDay = (day: number) => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        return events.filter((event) => {
            const eventDate = new Date(event.day);
            return (
                eventDate.getDate() === day &&
                eventDate.getMonth() === month &&
                eventDate.getFullYear() === year
            );
        });
    };

    const handleAddEvent = () => {
        if (selectedDay === null) {
            toast({
                title: "Error",
                description: "Please select a day to add an event.",
            });
            return;
        }

        if (!formData.name.trim()) {
            toast({
                title: "Error",
                description: "Event title cannot be empty.",
            });
            return;
        }

        const startTime = new Date(`1970-01-01T${formData.startTime}`);
        const endTime = new Date(`1970-01-01T${formData.endTime}`);
        if (startTime >= endTime) {
            toast({
                title: "Error",
                description: "Start time must be earlier than end time.",
            });
            return;
        }

        const dayString = `${selectedDay} ${currentDate.toLocaleDateString(
            "default",
            { month: "long", year: "numeric" }
        )}`;
        const storedEvents = localStorage.getItem("events");
        const events = storedEvents ? JSON.parse(storedEvents) : [];
        const isDuplicate = events.some(
            (event: { name: string; day: string }) =>
                event.name.trim().toLowerCase() ===
                    formData.name.trim().toLowerCase() &&
                event.day === dayString
        );

        if (isDuplicate) {
            toast({
                title: "Error",
                description: `An event with the title "${formData.name}" already exists for this day.`,
            });
            return;
        }
        const event: EventData = {
            ...formData,
            day: dayString,
            type: eventType,
        };
        events.push(event);
        localStorage.setItem("events", JSON.stringify(events));
        console.log("Toast triggered:", formData.name);
        toast({
            title: `Scheduled: ${formData.name}`,
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{formData.description}</code>
                </pre>
            ),
        });
        loadEventsFromStorage();
        setFormData({
            name: "",
            startTime: "",
            endTime: "",
            description: "",
            day: "",
            type: "",
        });
        setEventType("");
        setSelectedDay(null);
    };

    const handleDeleteEvent = (eventToDelete: EventData) => {
        const updatedEvents = events.filter((event) => event !== eventToDelete);
        setEvents(updatedEvents);
        localStorage.setItem("events", JSON.stringify(updatedEvents));
        toast({
            title: `Deleted: ${eventToDelete.name}`,
            description: `Event "${eventToDelete.name}" has been removed.`,
        });
    };

    const handleEditEvent = (event: EventData) => {
        setEditingEvent(event);
        setIsEditing(true);
        setFormData({ ...event });
    };

    const handleUpdateEvent = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingEvent) {
            const updatedEvents = events.map((event) =>
                event.name === editingEvent.name &&
                event.day === editingEvent.day
                    ? { ...formData }
                    : event
            );
            localStorage.setItem("events", JSON.stringify(updatedEvents));
            setEvents(updatedEvents);
            setEditingEvent(null);
            setIsEditing(false);
            setFormData({
                name: "",
                startTime: "",
                endTime: "",
                description: "",
                day: "",
                type: "",
            });
            toast({
                title: `Updated: ${formData.name}`,
                description: `Event "${formData.name}" has been updated.`,
            });
        }
    };

    const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    const calendarDays = generateCalendarDays();
    const isToday = (day: number) => {
        const today = new Date();
        return (
            today.getDate() === day &&
            today.getMonth() === currentDate.getMonth() &&
            today.getFullYear() === currentDate.getFullYear()
        );
    };

    return (
        <div className="w-full h-full flex flex-col">
            <div className="text-center p-8">
                <div className="mb-2 mt-4 text-5xl font-bold">Cali</div>
                <div className="mb-24 mt-4 text-3xl font-bold">
                    Your Dynamic Calendar
                </div>
                <div className="flex justify-between items-center mb-4 gap-4">
                    <Button onClick={handlePrevMonth} variant={"default"}>
                        Previous
                    </Button>
                    <h2 className="text-3xl">
                        {currentDate.toLocaleDateString("default", {
                            month: "long",
                            year: "numeric",
                        })}
                    </h2>
                    <Button onClick={handleNextMonth} variant={"default"}>
                        Next
                    </Button>
                </div>
                <div className="grid grid-cols-7 gap-2">
                    {daysOfWeek.map((day, index) => (
                        <div key={index} className="font-bold text-gray-700">
                            {day}
                        </div>
                    ))}
                    {calendarDays.map((day, index) => (
                        <div
                            key={index}
                            className={`h-24 p-2 relative flex items-center justify-center border rounded text-2xl text-center cursor-pointer 
                                ${
                                    day && isToday(day)
                                        ? "bg-[#1a1a1a] text-white"
                                        : ""
                                }
                                ${
                                    currentDay === day
                                        ? "bg-[#44c34e] text-white"
                                        : ""
                                }
                                ${day ? "" : "bg-gray-700"}
                            `}
                        >
                            {day}
                            {day && (
                                <Dialog
                                    open={selectedDay === day}
                                    onOpenChange={(isOpen) => {
                                        if (!isOpen) setSelectedDay(null);
                                    }}
                                >
                                    <DialogTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            onClick={() => setSelectedDay(day)}
                                            className="absolute top-2 left-2 border border-slate-300 rounded p-2 childCard"
                                        >
                                            <Pencil1Icon />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="bg-slate-700">
                                        <DialogHeader>
                                            <DialogTitle>
                                                Add New Event for {day}{" "}
                                                {currentDate.toLocaleDateString(
                                                    "default",
                                                    {
                                                        month: "long",
                                                        year: "numeric",
                                                    }
                                                )}
                                            </DialogTitle>
                                            <div>
                                                <form className="relative w-full h-full flex flex-col gap-4 mt-4">
                                                    <div className="flex flex-col">
                                                        <Label htmlFor="name">
                                                            Title
                                                        </Label>
                                                        <Input
                                                            type="text"
                                                            name="name"
                                                            placeholder="Title"
                                                            value={
                                                                formData.name
                                                            }
                                                            onChange={
                                                                handleInputChange
                                                            }
                                                            className="bg-white p-2 w-full rounded-lg mt-1 outline-none text-black"
                                                            required
                                                        />
                                                    </div>

                                                    <div className="flex flex-col">
                                                        <Label
                                                            aria-placeholder="type"
                                                            className="mb-2"
                                                        >
                                                            Type
                                                        </Label>
                                                        <Select
                                                            value={eventType}
                                                            onValueChange={
                                                                setEventType
                                                            }
                                                        >
                                                            <SelectTrigger className="w-full bg-white text-black">
                                                                <SelectValue placeholder="Type" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="work">
                                                                    Work
                                                                </SelectItem>
                                                                <SelectItem value="personal">
                                                                    Personal
                                                                </SelectItem>
                                                                <SelectItem value="others">
                                                                    Others
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div className="flex flex-row gap-4">
                                                        <div className="flex flex-col w-1/2">
                                                            <Label htmlFor="startTime">
                                                                Start Time
                                                            </Label>
                                                            <Input
                                                                type="time"
                                                                name="startTime"
                                                                value={
                                                                    formData.startTime
                                                                }
                                                                onChange={
                                                                    handleInputChange
                                                                }
                                                                className="bg-white p-2 w-full rounded-lg mt-1 outline-none text-black"
                                                                required
                                                            />
                                                        </div>
                                                        <div className="flex flex-col w-1/2">
                                                            <Label htmlFor="endTime">
                                                                End Time
                                                            </Label>
                                                            <Input
                                                                type="time"
                                                                name="endTime"
                                                                value={
                                                                    formData.endTime
                                                                }
                                                                onChange={
                                                                    handleInputChange
                                                                }
                                                                className="bg-white p-2 w-full rounded-lg mt-1 outline-none text-black"
                                                                required
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col">
                                                        <Label htmlFor="description">
                                                            Description
                                                        </Label>
                                                        <Textarea
                                                            name="description"
                                                            value={
                                                                formData.description
                                                            }
                                                            onChange={
                                                                handleInputChange
                                                            }
                                                            className="bg-white p-2 w-full rounded-lg mt-1 outline-none text-black"
                                                            required
                                                        />
                                                    </div>

                                                    <Button
                                                        type="button"
                                                        onClick={handleAddEvent}
                                                        variant={"default"}
                                                        className="mt-2"
                                                    >
                                                        Add
                                                    </Button>
                                                </form>
                                            </div>
                                        </DialogHeader>
                                    </DialogContent>
                                </Dialog>
                            )}
                            {day && (
                                <Button
                                    variant={"outline"}
                                    className="absolute h-6 bottom-2 left-2 border border-slate-300 rounded px-2"
                                    onClick={() => setCurrentDay(day)}
                                >
                                    {getEventsForDay(day).length} events
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            {currentDay && (
                <div className="p-8 flex flex-col items-start justify-center overflow-y-auto">
                    {getEventsForDay(currentDay).length > 0 ? (
                        <div className="bg-white-700 w-full">
                            <div>
                                <div className="mb-4 flex flex-row justify-between text-xl">
                                    <p>Events scheduled for this day</p>
                                    <Button
                                        variant={"default"}
                                        onClick={() => setCurrentDay(null)}
                                        className="mb-4 h-6"
                                    >
                                        Close
                                    </Button>
                                </div>
                                <div className="mb-4 px-1">
                                    <Input
                                        className="w-full h-10"
                                        placeholder="Search events"
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(
                                                e.target.value.toLowerCase()
                                            )
                                        }
                                    />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 flex flex-col gap-4">
                                        {getEventsForDay(currentDay)
                                            .filter((event) =>
                                                event.name
                                                    .toLowerCase()
                                                    .includes(searchTerm)
                                            )
                                            .map((event, idx) => (
                                                <Card
                                                    key={idx}
                                                    className={`cursor-pointer ${
                                                        event.type === "work" &&
                                                        "bg-red-900 text-white"
                                                    } ${
                                                        event.type ===
                                                            "personal" &&
                                                        "bg-yellow-600 text-white"
                                                    } ${
                                                        event.type ===
                                                            "others" &&
                                                        "bg-blue-600 text-white"
                                                    }`}
                                                >
                                                    <CardHeader>
                                                        <CardTitle className="text-base font-medium">
                                                            {event.name}
                                                        </CardTitle>
                                                        <CardDescription className="text-white">
                                                            {event.description}
                                                        </CardDescription>
                                                    </CardHeader>
                                                    <CardContent className="flex flex-row gap-2">
                                                        <Dialog>
                                                            <DialogTrigger
                                                                asChild
                                                            >
                                                                <Button
                                                                    className="h-6"
                                                                    onClick={() =>
                                                                        handleEditEvent(
                                                                            event
                                                                        )
                                                                    }
                                                                >
                                                                    Edit
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent className="bg-gray-800">
                                                                <DialogHeader>
                                                                    <DialogTitle className="text-3xl">
                                                                        Edit
                                                                        Event
                                                                    </DialogTitle>
                                                                    <DialogDescription>
                                                                        {isEditing &&
                                                                            editingEvent && (
                                                                                <form
                                                                                    onSubmit={
                                                                                        handleUpdateEvent
                                                                                    }
                                                                                    className="flex flex-col gap-2 text-xl"
                                                                                >
                                                                                    <Label htmlFor="name">
                                                                                        Title
                                                                                    </Label>
                                                                                    <Input
                                                                                        type="text"
                                                                                        name="name"
                                                                                        value={
                                                                                            formData.name
                                                                                        }
                                                                                        onChange={
                                                                                            handleInputChange
                                                                                        }
                                                                                        placeholder="Event Title"
                                                                                        required
                                                                                    />
                                                                                    <Label htmlFor="startTime">
                                                                                        Start
                                                                                        Time
                                                                                    </Label>
                                                                                    <Input
                                                                                        type="time"
                                                                                        name="startTime"
                                                                                        value={
                                                                                            formData.startTime
                                                                                        }
                                                                                        onChange={
                                                                                            handleInputChange
                                                                                        }
                                                                                        required
                                                                                    />
                                                                                    <Label htmlFor="endTime">
                                                                                        End
                                                                                        Time
                                                                                    </Label>
                                                                                    <Input
                                                                                        type="time"
                                                                                        name="endTime"
                                                                                        value={
                                                                                            formData.endTime
                                                                                        }
                                                                                        onChange={
                                                                                            handleInputChange
                                                                                        }
                                                                                        required
                                                                                    />
                                                                                    <Label htmlFor="description">
                                                                                        Description
                                                                                    </Label>
                                                                                    <Textarea
                                                                                        name="description"
                                                                                        value={
                                                                                            formData.description
                                                                                        }
                                                                                        onChange={
                                                                                            handleInputChange
                                                                                        }
                                                                                        placeholder="Description"
                                                                                    />
                                                                                    <Button
                                                                                        type="submit"
                                                                                        className="mt-4"
                                                                                    >
                                                                                        Update
                                                                                    </Button>
                                                                                    <Button
                                                                                        type="button"
                                                                                        onClick={() =>
                                                                                            setIsEditing(
                                                                                                false
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        Cancel
                                                                                    </Button>
                                                                                </form>
                                                                            )}
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                            </DialogContent>
                                                        </Dialog>

                                                        <Dialog>
                                                            <DialogTrigger>
                                                                <Button className="h-6">
                                                                    Delete
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent className="bg-gray-800">
                                                                <DialogHeader>
                                                                    <DialogTitle className="text-3xl">
                                                                        Are you
                                                                        absolutely
                                                                        sure?
                                                                    </DialogTitle>
                                                                    <DialogDescription className="flex flex-col gap-5 text-xl">
                                                                        <span>
                                                                            This
                                                                            action
                                                                            cannot
                                                                            be
                                                                            undone.
                                                                        </span>
                                                                        <Button
                                                                            variant={
                                                                                "destructive"
                                                                            }
                                                                            onClick={() =>
                                                                                handleDeleteEvent(
                                                                                    event
                                                                                )
                                                                            }
                                                                        >
                                                                            Delete
                                                                        </Button>
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                            </DialogContent>
                                                        </Dialog>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex w-full h-full flex-col">
                            <div className="w-full mb-4 flex flex-row justify-between text-xl">
                                <p>No Events Scheduled</p>
                                <Button
                                    variant={"default"}
                                    onClick={() => setCurrentDay(null)}
                                    className="mb-4 h-8"
                                >
                                    Close
                                </Button>
                            </div>
                            <Card className="cursor-pointer">
                                <CardHeader>
                                    <CardTitle>Sorry</CardTitle>
                                    <CardDescription>
                                        No Events scheduled
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Calendar;
