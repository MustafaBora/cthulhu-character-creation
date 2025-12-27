package com.bora.d100.exception;

public class XPCalculationMismatchException extends RuntimeException
{
    public XPCalculationMismatchException(int backend, int frontend)
    {
        super("XP calculation mismatch between frontend (" + frontend + ") and backend! (" + backend + ")");
    }
}
