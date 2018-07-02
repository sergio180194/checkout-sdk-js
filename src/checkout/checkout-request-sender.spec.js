import { createRequestSender } from '@bigcommerce/request-sender';
import { getCheckout } from './checkouts.mock';
import { ContentType } from '../common/http-request';
import { getResponse } from '../common/http-request/responses.mock';
import CheckoutRequestSender from './checkout-request-sender';

describe('CheckoutRequestSender', () => {
    let requestSender;
    let response;
    let checkoutRequestSender;

    const defaultIncludes = [
        'cart.lineItems.physicalItems.options',
        'cart.lineItems.digitalItems.options',
        'customer',
        'payments',
        'promotions.banners',
    ].join(',');

    beforeEach(() => {
        requestSender = createRequestSender();
        response = getResponse(getCheckout());

        jest.spyOn(requestSender, 'get').mockReturnValue(response);
        jest.spyOn(requestSender, 'put').mockReturnValue(response);
        checkoutRequestSender = new CheckoutRequestSender(requestSender);
    });

    describe('loadCheckout', () => {
        it('returns the response of the requestSender', async () => {
            expect(await checkoutRequestSender.loadCheckout('6cb62bfc-c92d-45f5-869b-d3d9681a58d4')).toEqual(response);
        });

        it('sends expected params to requestSender', async () => {
            await checkoutRequestSender.loadCheckout('6cb62bfc-c92d-45f5-869b-d3d9681a58d4');

            expect(requestSender.get).toHaveBeenCalledWith('/api/storefront/checkout/6cb62bfc-c92d-45f5-869b-d3d9681a58d4', {
                headers: {
                    Accept: ContentType.JsonV1,
                },
                params: {
                    include: defaultIncludes,
                },
                timeout: undefined,
            });
        });

        it('appends passed params when loading checkout', async () => {
            await checkoutRequestSender.loadCheckout('6cb62bfc-c92d-45f5-869b-d3d9681a58d4', {
                params: {
                    include: ['foo'],
                },
            });

            expect(requestSender.get).toHaveBeenCalledWith('/api/storefront/checkout/6cb62bfc-c92d-45f5-869b-d3d9681a58d4', {
                headers: {
                    Accept: ContentType.JsonV1,
                },
                params: {
                    include: defaultIncludes.concat(',foo'),
                    timeout: undefined,
                },
            });
        });
    });

    describe('updateCheckout', () => {
        it('returns the response of the requestSender', async () => {
            expect(await checkoutRequestSender.updateCheckout('6cb62bfc-c92d-45f5-869b-d3d9681a58d4', { customerMessage: 'foo' }))
                .toEqual(response);
        });

        it('sends expected params to requestSender', async () => {
            await checkoutRequestSender.updateCheckout(
                '6cb62bfc-c92d-45f5-869b-d3d9681a58d4',
                { customerMessage: 'foo' },
                {
                    params: {
                        include: ['foo'],
                    },
                }
            );

            expect(requestSender.put).toHaveBeenCalledWith('/api/storefront/checkout/6cb62bfc-c92d-45f5-869b-d3d9681a58d4', {
                headers: {
                    Accept: ContentType.JsonV1,
                },
                body: {
                    customerMessage: 'foo',
                },
                params: {
                    include: defaultIncludes.concat(',foo'),
                },
                timeout: undefined,
            });
        });
    });
});
