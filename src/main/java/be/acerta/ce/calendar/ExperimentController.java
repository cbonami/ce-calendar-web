package be.acerta.ce.calendar;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Builder;
import lombok.Data;
import lombok.extern.jackson.Jacksonized;
import lombok.extern.slf4j.Slf4j;
import org.atmosphere.config.managed.Decoder;
import org.atmosphere.config.managed.Encoder;
import org.atmosphere.config.service.Disconnect;
import org.atmosphere.config.service.ManagedService;
import org.atmosphere.config.service.Ready;
import org.atmosphere.cpr.AtmosphereResource;
import org.atmosphere.cpr.AtmosphereResourceEvent;

import java.io.IOException;

@ManagedService(path = "/websocket")
@Slf4j
public class ExperimentController {

    @Ready
    public void onReady(
            final AtmosphereResource resource
    ) {
        log.info("Connected {}", resource.uuid());
    }

    @Disconnect
    public void onDisconnect(
            final AtmosphereResourceEvent event
    ) {
        log.info(
                "Client {} disconnected [{}]",
                event.getResource().uuid(),
                event.isCancelled()
        );
    }

    @org.atmosphere.config.service.Message(
            encoders = JacksonEncoderDecoder.class,
            decoders = JacksonEncoderDecoder.class
    )
    public Message onMessage(
            final Message message
    ) {
        System.out.println(message);
        return Message.builder()
                .message(message.getMessage())
                .author("em")
                .build();
    }

    public static class JacksonEncoderDecoder implements Encoder<Message, String>,
            Decoder<String, Message> {

        private final ObjectMapper mapper = new ObjectMapper();

        @Override
        public String encode(Message m) {
            try {
                return this.mapper.writeValueAsString(m);
            } catch (IOException ex) {
                throw new IllegalStateException(ex);
            }
        }

        @Override
        public Message decode(String s) {
            try {
                return this.mapper.readValue(s, Message.class);
            } catch (IOException ex) {
                throw new IllegalStateException(ex);
            }
        }

    }

    @Data
    @Builder
    @Jacksonized
    public static class Message {
        String message;
        String author;
    }

}