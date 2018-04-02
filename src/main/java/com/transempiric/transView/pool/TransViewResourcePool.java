/*
 * MIT License
 *
 * Copyright (c) 2018 Transempiric
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

package com.transempiric.transView.pool;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.time.Instant;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.locks.ReentrantLock;

public abstract class TransViewResourcePool<Resource> {
    private static final Log logger = LogFactory.getLog(TransViewResourcePool.class);
    private static final int DEFAULT_INITIAL_POOL_SIZE = 3;
    private static final int DEFAULT_MAX_POOL_SIZE = 10;

    private final BlockingQueue<Resource> pool;
    private final ReentrantLock lock = new ReentrantLock();
    private int createdObjects = 0;
    private int maxPoolSize;
    private int initialPoolSize;
    private Boolean dynamicEngineCreation;
    private Boolean showPoolStatsCSV;
    private Boolean showPoolStatsLOG;

    public TransViewResourcePool() {
        this(DEFAULT_INITIAL_POOL_SIZE, DEFAULT_MAX_POOL_SIZE);
    }

    public TransViewResourcePool(Integer initialPoolSize, Integer maxPoolSize) {
        this(initialPoolSize, maxPoolSize, true);
    }

    public TransViewResourcePool(Integer initialPoolSize, Integer maxPoolSize, Boolean dynamicEngineCreation) {
        this(initialPoolSize, maxPoolSize, dynamicEngineCreation, false, false);
    }

    public TransViewResourcePool(Integer initialPoolSize, Integer maxPoolSize, Boolean dynamicEngineCreation, Boolean showPoolStatsCSV, Boolean showPoolStatsLOG) {
        this.initialPoolSize = initialPoolSize != null ? initialPoolSize : DEFAULT_INITIAL_POOL_SIZE;
        this.maxPoolSize = maxPoolSize != null ? maxPoolSize : DEFAULT_MAX_POOL_SIZE;

        this.dynamicEngineCreation = dynamicEngineCreation != null ? dynamicEngineCreation : false;

        this.showPoolStatsCSV = (showPoolStatsCSV != null ? showPoolStatsCSV : false);
        this.showPoolStatsLOG = (showPoolStatsLOG != null ? showPoolStatsLOG : false);

        this.pool = new ArrayBlockingQueue<>(maxPoolSize, true);

        if (!this.dynamicEngineCreation) {
            this.lock.lock();
        }

        showStats("POOL_INITIALIZATION", null);
    }

    protected Resource acquire() throws Exception {
        showStats("ACQUIRE -- START", null);

        // Offer a new resource if necessary;
        if (offerNewResource()) doOfferResource();

        Resource resource = this.pool.take();

        showStats("ACQUIRE -- END", resource.hashCode());

        return resource;
    }

    protected void recycle(Resource resource) throws RuntimeException {
        showStats("RECYCLE -- START", resource.hashCode());

        boolean acceptedOffer = this.pool.offer(resource);

        showStats("RECYCLE -- END: acceptedOffer = " + acceptedOffer, resource.hashCode());
    }

    protected void createPool() {
        showStats("CREATE_POOL -- START", null);

        for (int i = 0; i < this.initialPoolSize; ++i) {
            if (!lock.isLocked()) {
                Resource resource = createObject();
                this.pool.add(resource);
                this.createdObjects++;

                showStats("CREATE_POOL -- CREATED_OBJECT", resource.hashCode());

                if (this.createdObjects >= this.maxPoolSize || this.pool.remainingCapacity() < 1) {
                    showStats("CREATE_POOL -- LOCKING: maximum capacity found", null);
                    this.lock.lock();
                }
            }
        }

        showStats("CREATE_POOL -- END", null);
    }

    private boolean offerNewResource() {
        showStats("OFFER_NEW_RESOURCE_CHECK -- START", null);
        if (this.lock.isLocked() && !this.lock.isHeldByCurrentThread()) return false;
        if (this.createdObjects >= this.maxPoolSize) return false;
        if (this.pool.peek() != null) return false;

        if (!this.lock.tryLock()) return false;

        return true;
    }

    private void doOfferResource() {
        showStats("OFFERING_NEW_RESOURCE -- START: pool not locked, capacity found, and pool queue was empty", null);
        boolean acceptedOffer;
        try {
            Resource resource = createObject();
            acceptedOffer = this.pool.offer(resource);
            if (acceptedOffer) this.createdObjects++;
            showStats("OFFERED_NEW_RESOURCE -- ACCEPTED_OFFER: acceptedOffer = " + acceptedOffer, (acceptedOffer ? resource.hashCode() : null));
        } finally {
            if (this.createdObjects < this.maxPoolSize && this.pool.remainingCapacity() > 0) {
                showStats("OFFERED_NEW_RESOURCE -- UNLOCK_POOL: capacity found after offered resource", null);
                this.lock.unlock();
            } else {
                this.lock.lock();
                showStats("OFFERED_NEW_RESOURCE -- LOCK_POOL: capacity NOT found after offer", null);
            }
        }
    }

    private void showStats(String message, Integer resourceHash) {
        if (this.showPoolStatsLOG && this.showPoolStatsCSV) {
            logger.error("TransViewError: both showPoolStatsLOG && showPoolStatsCSV are true. Please select one.");
        } else if (this.showPoolStatsLOG) {
            this.statLOG(message, resourceHash);
        } else if (this.showPoolStatsCSV){
            statsCSV(message, resourceHash);
        }
    }

    private void statsCSV(String message, Integer resourceHash) {
        String result = Thread.currentThread().getId()
                + ", " + ((Instant.now()).toEpochMilli())
                + ", " + (resourceHash != null ? resourceHash : "N/A")
                + ", " + (this.pool != null ? this.pool.remainingCapacity() : "N/A")
                + ", " + (this.pool != null ? this.pool.size() : "N/A")
                + ", " + (this.lock != null ? this.lock.hasQueuedThreads() : "N/A")
                + ", " + (this.lock != null ? this.lock.getHoldCount() : "N/A")
                + ", " + (this.lock != null ? this.lock.isLocked() : "N/A")
                + ", " + (this.lock != null ? this.lock.getQueueLength() : "N/A")
                + ", " + (this.lock != null ? this.lock.isHeldByCurrentThread() : "N/A")
                + ", " + message;

        System.out.println(result);
    }

    private void statLOG(String message, Integer resourceHash) {
        String result =
                "\n\n-------------- TRANS_VIEW_POOL_STATS --------------"
                        + "\n\t---- " + message + " ----"
                        + "\n\t{"
                        + "\n\t\tthreadId: " + Thread.currentThread().getId()
                        + "\n\t\ttimestamp: " + ((Instant.now()).toEpochMilli())
                        + "\n\t\tresourceHash: " + (resourceHash != null ? resourceHash : "N/A")
                        + "\n\t\tpoolSize: " + (this.pool != null ? this.pool.size() : "N/A")
                        + "\n\t\tpoolRemainingCapacity: " + (this.pool != null ? this.pool.remainingCapacity() : "N/A")
                        + "\n\t\tcreatedObjects < maxPoolSize: " + (this.createdObjects < this.maxPoolSize)
                        + "\n\t\tisPoolQueueEmpty: " + (this.pool != null ? (this.pool.peek() == null) : "N/A")
                        + "\n\t\tppolHasQueuedThreads: " + (this.lock != null ? this.lock.hasQueuedThreads() : "N/A")
                        + "\n\t\tlockHoldCount: " + (this.lock != null ? this.lock.getHoldCount() : "N/A")
                        + "\n\t\tlockedIsLocked: " + (this.lock != null ? this.lock.isLocked() : "N/A")
                        + "\n\t\tlockQueueLength: " + (this.lock != null ? this.lock.getQueueLength() : "N/A")
                        + "\n\t\tlockIsHeldByCurrentThread: " + (this.lock != null ? this.lock.isHeldByCurrentThread() : "N/A")
                        + "\n\t}\n\n";

        logger.warn(result);
    }

    protected abstract Resource createObject();
}