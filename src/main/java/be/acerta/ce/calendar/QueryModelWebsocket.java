package be.acerta.ce.calendar;

import lombok.extern.slf4j.Slf4j;
import org.atmosphere.config.service.ManagedService;
import org.atmosphere.config.service.PathParam;
import org.atmosphere.interceptor.IdleResourceInterceptor;

/**
 * Om een websocket te definiëren volstaat het om een klasse te annoteren met een @ManagedService annotatie waarin het
 * pad van de websocket wordt gespecifieerd en nog een aantal extra parameters.
 * Van belang hier is de IdleResourceInterceptor en de DistributedBroadcaster, de broadcasterCache is normaal
 * standaard UUIDBroadcasterCache maar is hier voor de volledigheid ook aan toegevoegd.
 * <p>
 * Het pad hieronder is een dynamisch pad gespecifieerd "/websocket/{qm: [0-9]*}" met een named parameter "qm".
 * De reguliere expressie [0-9]* is eerder informatief en gaat atmosphere niet strikt afchecken.
 * Uiteraard zijn ook vaste paden mogelijk in het geval er meer algemene gepushed moeten worden naar een browser client.
 */
@ManagedService(
        path = "/websocket/{qm: [0-9]*}",
        interceptors = {IdleResourceInterceptor.class}
)
@Slf4j
public class QueryModelWebsocket {

    @PathParam("qm")
    private String qm;

}