"use client";

import { Center, Flex, Title, Text, Button, Badge, Blockquote } from "@mantine/core";
import Image from "next/image";

export default function NewProjectUI() {
  const projectTypes = [
    {
      title: "Python",
      description: "For most Python projects.",
      badge: ["Recommended"],
      icon: "/assets/python-logo.svg",
      iconAlt: "Python logo",
      iconW: 40.75,
      iconH: 33.625,
    },
    {
      title: "Python with Pygame CE",
      description: "Want to create a game? Start here.",
      badge: ["Experimental"],
      icon: "/assets/python-logo.svg",
      iconAlt: "Python logo",
      iconW: 40.75,
      iconH: 33.625,
    },
  ];
  return (
    <div className="flex flex-col w-full h-full justify-center align-center pl-24 pr-24 pt-4 pb-4">
      <Title order={2}>How would you like to start your project?</Title>
      <Text>
        Select from any of the project types here. You can change this at any
        time.
      </Text>
      {projectTypes.map((pt) => (
        <button className="flex flex-row pl-4 pr-4 pt-2 pb-2 border-none gap-2 w-full text-left">
          <Image
            src={pt.icon}
            alt={pt.iconAlt}
            width={pt.iconW}
            height={pt.iconH}
          />
          <div>
            <div className="flex flex-row gap-2 items-center">
              <Title order={4}>{pt.title}</Title>
              {pt.badge.map((badge) => (
                <Badge>{badge}</Badge>
              ))}
            </div>
            <Text>{pt.description}</Text>
          </div>
        </button>
      ))}
    </div>
  );
}
