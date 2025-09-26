import { Anchor, TextInput } from '@mantine/core';
import { Text, Center, Stack, Button } from "@mantine/core";
import React, { useState } from "react";
import QRCode from "react-qr-code";
import Service from '../../utils/http';

const UrlShortner = () => {
  const service = new Service();
  const [originalUrl, setOriginalUrl] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [title, setTitle] = useState('');
  const [expiry, setExpiry] = useState('');
  const [shortUrlData, setShortUrlData] = useState(null);

  const getShortUrl = async () => {
    try {
      const response = await service.post('s', {
        customUrl,
        originalUrl,
        expiresAt: expiry,
        title
      });
      console.log("Short URL created:", response.data);
      setShortUrlData(response.data);
    } catch (err) {
      console.error("Error creating short URL:", err);
    }
  };

  return (
    <div>
      <Center style={{ minHeight: "90vh" }}>
        {!shortUrlData ? (
          <Stack style={{ width: '40vw' }}>
            <Text size='30px' align='center'>Shorten Your URL Here</Text>

            <TextInput
              label="Original URL"
              withAsterisk
              onChange={(e) => setOriginalUrl(e.target.value)}
              value={originalUrl}
            />
            <TextInput
              label="Custom URL (optional)"
              onChange={(e) => setCustomUrl(e.target.value)}
              value={customUrl}
            />
            <TextInput
              label="Title (optional)"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
            <TextInput
              label="Expiry Date (optional)"
              type="date"
              onChange={(e) => setExpiry(e.target.value)}
              value={expiry}
            />

            <Button
              variant='outline'
              disabled={!originalUrl}
              onClick={getShortUrl}
            >
              Generate Short URL
            </Button>
          </Stack>
        ) : (
          <Stack align="center" spacing="md">
            <Text>Here is your short URL:</Text>

            {/* ✅ Point to public redirect route /r/:shortCode */}
            <Anchor
              href={`${service.getBaseURL()}/s/${shortUrlData.shortCode}`}
              target="_blank"
            >
              {shortUrlData.shortCode}
            </Anchor>

            <Text>Scan the QR code to open:</Text>
          <QRCode
              value={shortUrlData.originalUrl} // ✅ QR code points directly to original URL
              size={180}
            />
          </Stack>
        )}
      </Center>
    </div>
  );
};

export default UrlShortner;
