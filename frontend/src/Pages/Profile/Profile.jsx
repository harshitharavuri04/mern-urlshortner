import React, { useEffect, useState } from "react";
import { Card, Image, Text, Badge,Center,Box } from "@mantine/core";
import Service from "../../utils/http";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const service = new Service();

  const fetchProfile = async () => {
    try {
      const data = await service.get("user/me");
      setProfile(data);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

 return (
  <Center style={{ minHeight: "100vh" }}>
    <Card shadow="sm" padding="xl" radius="lg" withBorder>
      <Card.Section>
        <Image src={profile.avatar} h={180} alt={profile.name} fit="cover" />
      </Card.Section>

      <Text fw={600} size="xl" mt="md" align="center">
        {profile.name}
      </Text>

      <Text size="sm" c="dimmed" align="center" mt="xs">
        {profile.email}
      </Text>

      <div className="flex justify-center mt-3">
        <Badge color="blue" variant="light">
          {profile.role}
        </Badge>
      </div>

      <Text size="xs" c="dimmed" align="center" mt="md">
        Joined on {new Date(profile.createdAt).toLocaleDateString()}
      </Text>
    </Card>
  </Center>
);

};

export default Profile;
