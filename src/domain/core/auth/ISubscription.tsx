import { BizType } from "../../core/IService";

export interface ISubscription {
    entityId: string
    serviceId: BizType
    planId: string;
}

export interface IUnSubscription {
    entityId: string
    serviceId: BizType
}

export interface IEntitySuscription {
    createdAt: Date
    entityId: string
    plan: string
    serviceId: string
    startDate: Date
    status: string
}

export interface StripeInvoice {
    id: string;
    object: 'invoice';
    account_country?: string;
    account_name?: string;
    account_tax_ids?: Array<string> | null;
    amount_due: number;
    amount_paid: number;
    amount_remaining: number;
    application?: string | null;
    application_fee_amount?: number | null;
    attempt_count: number;
    attempted: boolean;
    auto_advance?: boolean;
    automatic_tax: {
        enabled: boolean;
        status: string | null;
    };
    billing_reason?: string | null;
    charge?: string | null;
    collection_method: 'charge_automatically' | 'send_invoice';
    created: number;
    currency: string;
    custom_fields?: Array<{
        name: string;
        value: string;
    }> | null;
    customer: string;
    customer_address?: {
        city?: string;
        country?: string;
        line1?: string;
        line2?: string;
        postal_code?: string;
        state?: string;
    } | null;
    customer_email?: string | null;
    customer_name?: string | null;
    customer_phone?: string | null;
    customer_shipping?: {
        address: {
            city?: string;
            country?: string;
            line1?: string;
            line2?: string;
            postal_code?: string;
            state?: string;
        };
        name: string;
        phone?: string;
    } | null;
    customer_tax_exempt?: 'exempt' | 'none' | 'reverse' | null;
    customer_tax_ids?: Array<{
        type: string;
        value: string;
    }> | null;
    default_payment_method?: string | null;
    default_source?: string | null;
    default_tax_rates?: Array<{
        active: boolean;
        created: number;
        description: string | null;
        display_name: string;
        id: string;
        inclusive: boolean;
        jurisdiction: string | null;
        livemode: boolean;
        metadata: Record<string, string>;
        percentage: number;
        state: string | null;
        tax_type: string | null;
    }> | null;
    description?: string | null;
    discount?: {
        coupon: {
            id: string;
            object: 'coupon';
            amount_off?: number | null;
            created: number;
            currency?: string | null;
            duration: 'forever' | 'once' | 'repeating';
            duration_in_months?: number | null;
            livemode: boolean;
            max_redemptions?: number | null;
            metadata: Record<string, string>;
            name?: string | null;
            percent_off?: number | null;
            redeem_by?: number | null;
            times_redeemed: number;
            valid: boolean;
        };
        customer?: string | null;
        discount: string;
        end?: number | null;
        invoice?: string | null;
        invoice_item?: string | null;
        promotion_code?: string | null;
        start: number;
        subscription?: string | null;
    } | null;
    discounts?: Array<string> | null;
    due_date?: number | null;
    ending_balance?: number | null;
    footer?: string | null;
    from_invoice?: {
        action: string;
        invoice: string;
    } | null;
    hosted_invoice_url?: string | null;
    invoice_pdf?: string | null;
    last_finalization_error?: any | null;
    latest_revision?: string | null;
    lines: {
        data: Array<StripeInvoiceLineItem>;
        has_more: boolean;
        object: 'list';
        url: string;
    };
    livemode: boolean;
    metadata: Record<string, string>;
    next_payment_attempt?: number | null;
    number?: string | null;
    on_behalf_of?: string | null;
    paid: boolean;
    paid_out_of_band: boolean;
    payment_intent?: string | null;
    payment_settings: {
        default_mandate?: string | null;
        payment_method_options?: any | null;
        payment_method_types?: Array<string> | null;
    };
    period_end: number;
    period_start: number;
    post_payment_credit_notes_amount: number;
    pre_payment_credit_notes_amount: number;
    quote?: string | null;
    receipt_number?: string | null;
    rendering?: any | null;
    rendering_options?: {
        amount_tax_display?: string | null;
    } | null;
    starting_balance: number;
    statement_descriptor?: string | null;
    status?: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void';
    status_transitions: {
        finalized_at?: number | null;
        marked_uncollectible_at?: number | null;
        paid_at?: number | null;
        voided_at?: number | null;
    };
    subscription?: string | null;
    subscription_details?: {
        metadata?: Record<string, string>;
    } | null;
    subtotal: number;
    subtotal_excluding_tax?: number | null;
    tax?: number | null;
    test_clock?: string | null;
    total: number;
    total_discount_amounts?: Array<{
        amount: number;
        discount: string;
    }> | null;
    total_excluding_tax?: number | null;
    total_tax_amounts?: Array<{
        amount: number;
        inclusive: boolean;
        tax_rate: string;
        taxability_reason?: string | null;
        taxable_amount?: number | null;
    }> | null;
    transfer_data?: {
        destination: string;
    } | null;
    webhooks_delivered_at?: number | null;

    service?: any
     date?: any
    price?: any


}

interface StripeInvoiceLineItem {
    id: string;
    object: 'line_item';
    amount: number;
    amount_excluding_tax: number;
    currency: string;
    description: string | null;
    discount_amounts: Array<{
        amount: number;
        discount: string;
    }> | null;
    discountable: boolean;
    discounts: Array<string> | null;
    invoice_item?: string;
    livemode: boolean;
    metadata: Record<string, string>;
    period: {
        end: number;
        start: number;
    };
    plan?: {
        id: string;
        object: 'plan';
        active: boolean;
        aggregate_usage: string | null;
        amount: number | null;
        amount_decimal: string | null;
        billing_scheme: 'per_unit' | 'tiered';
        created: number;
        currency: string;
        interval: 'day' | 'month' | 'week' | 'year';
        interval_count: number;
        livemode: boolean;
        metadata: Record<string, string>;
        nickname: string | null;
        product: string;
        tiers?: Array<{
            flat_amount: number | null;
            flat_amount_decimal: string | null;
            unit_amount: number | null;
            unit_amount_decimal: string | null;
            up_to: number | null;
        }> | null;
        tiers_mode: string | null;
        transform_usage: {
            divide_by: number;
            round: 'up' | 'down';
        } | null;
        trial_period_days: number | null;
        usage_type: 'licensed' | 'metered';
    } | null;
    price?: {
        id: string;
        object: 'price';
        active: boolean;
        billing_scheme: 'per_unit' | 'tiered';
        created: number;
        currency: string;
        custom_unit_amount: {
            maximum: number | null;
            minimum: number | null;
            preset: number | null;
        } | null;
        livemode: boolean;
        lookup_key: string | null;
        metadata: Record<string, string>;
        nickname: string | null;
        product: string;
        recurring: {
            aggregate_usage: string | null;
            interval: 'day' | 'month' | 'week' | 'year';
            interval_count: number;
            trial_period_days: number | null;
            usage_type: 'licensed' | 'metered';
        } | null;
        tax_behavior: 'exclusive' | 'inclusive' | 'unspecified';
        tiers?: Array<{
            flat_amount: number | null;
            flat_amount_decimal: string | null;
            unit_amount: number | null;
            unit_amount_decimal: string | null;
            up_to: number | null;
        }> | null;
        tiers_mode: string | null;
        transform_quantity: {
            divide_by: number;
            round: 'up' | 'down';
        } | null;
        type: 'one_time' | 'recurring';
        unit_amount: number | null;
        unit_amount_decimal: string | null;
    } | null;
    proration: boolean;
    quantity: number | null;
    subscription?: string | null;
    subscription_item?: string | null;
    tax_amounts: Array<{
        amount: number;
        inclusive: boolean;
        tax_rate: string;
        taxability_reason?: string | null;
        taxable_amount?: number | null;
    }> | null;
    tax_rates: Array<{
        active: boolean;
        country: string | null;
        created: number;
        description: string | null;
        display_name: string;
        id: string;
        inclusive: boolean;
        jurisdiction: string | null;
        livemode: boolean;
        metadata: Record<string, string>;
        percentage: number;
        state: string | null;
        tax_type: string | null;
    }> | null;
    type: 'invoiceitem' | 'subscription';
    unit_amount_excluding_tax: string | null;
}

