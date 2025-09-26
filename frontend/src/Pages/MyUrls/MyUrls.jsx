import { Table, Button, Anchor } from "@mantine/core";
import React, { useEffect, useState } from "react";
import Service from "../../utils/http";

const MyUrls = () => {
  const service = new Service();
  const [urlList, setUrlList] = useState([]);

  const getData = async () => {
    const response = await service.get("user/my/urls");
    console.log(response);
    setUrlList(response.shortURLs || []);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>

      <Table  withColumnBorders withRowBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Title</Table.Th>
            <Table.Th>Original URL</Table.Th>
            <Table.Th>Short URL</Table.Th>
            <Table.Th>Expires At</Table.Th>
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
                  href={`${service.getBaseURL()}/api/s/${item.shortCode}`}
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
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </div>
  );
};

export default MyUrls;
