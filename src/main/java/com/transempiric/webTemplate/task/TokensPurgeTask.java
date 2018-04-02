package com.transempiric.webTemplate.task;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Date;

@Service
@Transactional
public class TokensPurgeTask {
    private final Log logger = LogFactory.getLog(this.getClass());

    @Scheduled(cron = "${transempiric.app.purge.cron.expression}")
    public void purgeExpired() {

        Date now = Date.from(Instant.now());

        logger.warn("Running TokensPurgeTask shceduled, " + now + "...");
    }
}
