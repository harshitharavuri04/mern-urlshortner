import { Anchor, TextInput } from '@mantine/core'
import { Text, Center, Stack, Button } from "@mantine/core";
import React, { useState } from "react";
import QRCode from "react-qr-code";   // ✅ Import QRCode
import Service from '../../utils/http';

const UrlShortner = () => {
  const service = new Service();
  const [OriginalUrl, setOriginalUrl] = useState('');
  const [CustomUrl, setCustomUrl] = useState('');
  const [Title, setTitle] = useState('');
  const [Expiry, setExpiry] = useState('');
  const [ShortUrlData, setShortUrlData] = useState(null);

  

  const getShortUrl = async () => {
    const response = await service.post('s', {
      customUrl: CustomUrl,
      originalUrl: OriginalUrl,
      expiresAt: Expiry,
      title: Title
    });
    console.log(response);
    setShortUrlData(response.data);
  };

  return (
    <div>
      <Center style={{ minHeight: "90vh" }}>
        {!ShortUrlData ? (
          <Stack style={{ width: '40vw' }}>
            <Text size='30px' align='center'> Short Your Url Here</Text>

            <TextInput
              label="Original Url"
              withAsterisk
              onChange={(e) => setOriginalUrl(e.target.value)}
              value={OriginalUrl}
            />
            <TextInput
              label="Customise your Url (optional)"
              onChange={(e) => setCustomUrl(e.target.value)}
              value={CustomUrl}
            />
            <TextInput
              label="Title (optional)"
              onChange={(e) => setTitle(e.target.value)}
              value={Title}
            />
            <TextInput
              label="Date of expiry (optional)"
              onChange={(e) => setExpiry(e.target.value)}
              value={Expiry}
              type="date"
            />

            <Button
              variant='outline'
              disabled={!OriginalUrl}
              onClick={getShortUrl}
            >
              Generate and show Url
            </Button>
          </Stack>
        ) : (
          <Stack align="center" spacing="md">
    <Anchor
      href={`${service.getBaseURL()}/api/s/${ShortUrlData.shortCode}`}
      target="_blank"
    >
      {ShortUrlData.shortCode}
    </Anchor>

    <QRCode
      value={`${service.getBaseURL()}/api/s/${ShortUrlData.shortCode}`}
      size={180}
    />
  </Stack>
        )}
      </Center>
    </div>
  );
};

export default UrlShortner;
