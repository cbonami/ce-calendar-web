package be.acerta.ce.calendar;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class AtmosphereMessage {
    String type;
    String topic;
    Object body;
    String acertaProcessId;
}