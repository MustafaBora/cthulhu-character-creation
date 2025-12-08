package com.bora.d100.service;

public class CostSegment {
    private final int from;
    private final int to;
    private final int costPerPoint;

    public CostSegment(int from, int to, int costPerPoint) {
        this.from = from;
        this.to = to;
        this.costPerPoint = costPerPoint;
    }

    public boolean contains(int value) {
        return value >= from && value < to;
    }

    public int getCostPerPoint() {
        return costPerPoint;
    }
}
