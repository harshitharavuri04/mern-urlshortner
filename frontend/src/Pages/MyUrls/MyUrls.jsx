import { Table, Button, Anchor, Modal, TextInput, Stack, Group, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";
import Service from "../../utils/http";

const MyUrls = () => {
  const service = new Service();
  const [urlList, setUrlList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [opened, setOpened] = useState(false);
  const [editingUrl, setEditingUrl] = useState(null);

  // Fetch URLs
  const getData = async () => {
    try {
      setLoading(true);
      const response = await service.get("user/my/urls");

      // ✅ Detect if Service returns raw JSON (fetch) or Axios-style (response.data)
      const shortURLs = response?.shortURLs || response?.data?.shortURLs || [];
      console.log("Fetched URLs:", shortURLs); // Debug

      setUrlList(shortURLs);
    } catch (err) {
      console.error("Error fetching URLs:", err);
      setUrlList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Delete URL
  const handleDelete = async (shortCode) => {
    if (!window.confirm("Are you sure you want to delete this short URL?")) return;
    try {
      await service.delete(`s/${shortCode}`);
      setUrlList((prev) => prev.filter((u) => u.shortCode !== shortCode));
    } catch (err) {
      console.error("Error deleting URL:", err);
    }
  };

  // Save edited URL
  const handleEditSave = async () => {
    if (!editingUrl) return;
    try {
      await service.patch(`s/${editingUrl.shortCode}`, editingUrl);
      setUrlList((prev) =>
        prev.map((u) => (u.shortCode === editingUrl.shortCode ? editingUrl : u))
      );
      setOpened(false);
    } catch (err) {
      console.error("Error updating URL:", err);
    }
  };

  return (
    <div>
      {loading ? (
        <Text>Loading URLs...</Text>
      ) : urlList.length === 0 ? (
        <Text>No URLs found. Create some short URLs to see them here.</Text>
      ) : (
        <Table withColumnBorders withRowBorders striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Title</Table.Th>
              <Table.Th>Original URL</Table.Th>
              <Table.Th>Short URL</Table.Th>
              <Table.Th>Expires At</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {urlList.map((item) => (
              <Table.Tr key={item._id}>
                <Table.Td>{item.title || "—"}</Table.Td>
                <Table.Td>
                  <Anchor href={item.originalUrl} target="_blank">
                    {item.originalUrl.length > 40
                      ? item.originalUrl.slice(0, 40) + "..."
                      : item.originalUrl}
                  </Anchor>
                </Table.Td>
                <Table.Td>
                  <Anchor
                    href={`${service.getBaseURL?.() || ""}/api/s/${item.shortCode}`}
                    target="_blank"
                  >
                    {item.shortCode}
                  </Anchor>
                </Table.Td>
                <Table.Td>
                  {item.expiresAt
                    ? new Date(item.expiresAt).toLocaleDateString()
                    : "—"}
                </Table.Td>
                <Table.Td>
                  <Group spacing="xs">
                    <Button
                      size="xs"
                      onClick={() => {
                        setEditingUrl(item);
                        setOpened(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="xs"
                      color="red"
                      onClick={() => handleDelete(item.shortCode)}
                    >
                      Delete
                    </Button>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}

      {/* Edit Modal */}
      <Modal opened={opened} onClose={() => setOpened(false)} title="Edit Short URL">
        {editingUrl && (
          <Stack>
            <TextInput
              label="Title"
              value={editingUrl.title || ""}
              onChange={(e) => setEditingUrl({ ...editingUrl, title: e.target.value })}
            />
            <TextInput
              label="Original URL"
              value={editingUrl.originalUrl}
              onChange={(e) =>
                setEditingUrl({ ...editingUrl, originalUrl: e.target.value })
              }
            />
            <TextInput
              label="Expiry Date"
              type="date"
              value={editingUrl.expiresAt ? editingUrl.expiresAt.split("T")[0] : ""}
              onChange={(e) =>
                setEditingUrl({ ...editingUrl, expiresAt: e.target.value })
              }
            />
            <Button onClick={handleEditSave}>Save Changes</Button>
          </Stack>
        )}
      </Modal>
    </div>
  );
};

export default MyUrls;
